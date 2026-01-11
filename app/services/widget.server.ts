import { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import { SettingsService, WidgetSettings } from "./settings.server";
import { parse as parseJsonc } from "jsonc-parser";
import { SessionService } from "./session.server";

type ThemeExtensionStatus = "active" | "disabled" | "not_installed";

export class WidgetService {
  private static readonly METAFIELD_NAMESPACE = "vivollo";
  private static readonly METAFIELD_KEY = "config";
  private static readonly METAFIELD_TYPE = "json";
  private static readonly THEME_SETTINGS_FILE = "config/settings_data.json";
  private static readonly BLOCK_HANDLE = "chat_widget";

  static async publishWidget(sessionId: string, admin: AdminApiContext) {
    const session = await SessionService.findByIdOrFail(sessionId);

    if (!session.channelId || !session.tenantName) {
      throw new Error("Session channelId or tenantName not found.");
    }

    const settings = await SettingsService.getSettings(sessionId);
    const value = this.buildConfigValue(session.channelId, session.tenantName, settings);

    const shopId = await this.getShopIdOrFail(admin);
    await this.upsertShopMetafield(admin, shopId, value);

    await SessionService.update(sessionId, { hasPublishedWidget: true });
  }

  static async syncProducts(sessionId: string) {
    await SessionService.update(sessionId, { hasSyncedProducts: true });
  }

  static async getOnboardingStatus(admin: AdminApiContext, sessionId: string, shop: string) {
    const session = await SessionService.findByIdOrFail(sessionId);
    const extensionStatus = await this.getThemeExtensionStatus(admin, shop);

    return {
      hasCustomizedWidget: Boolean(session.hasCustomizedWidget),
      hasPublishedWidget:
        Boolean(session.hasPublishedWidget) && extensionStatus.status === "active",
      hasSyncedProducts: Boolean(session.hasSyncedProducts),
      extensionDeepLink: extensionStatus.deepLink,
    };
  }

  static async getThemeExtensionStatus(admin: AdminApiContext, shop: string) {
    const apiKey = process.env.SHOPIFY_API_KEY;

    if (!apiKey) {
      console.warn("SHOPIFY_API_KEY is not defined.");
      return { status: "not_installed" as const, deepLink: null as string | null };
    }

    const deepLink = this.buildThemeEditorDeepLink(shop, apiKey);

    const settingsContent = await this.getMainThemeSettingsDataJson(admin);
    if (!settingsContent) return { status: "not_installed" as const, deepLink };

    const settingsData = this.safeJsonParse(settingsContent);
    if (!settingsData) return { status: "not_installed" as const, deepLink };

    const status = this.detectAppEmbedStatus(settingsData, apiKey);
    return { status, deepLink };
  }

  private static buildConfigValue(
    channelId: string | null,
    tenantName: string,
    settings: WidgetSettings
  ) {
    return JSON.stringify({
      channelId,
      tenantId: tenantName,
      ...settings,
    });
  }

  private static async getShopIdOrFail(admin: AdminApiContext) {
    const response = await admin.graphql(
      `#graphql
      query GetShopId {
        shop { id }
      }`
    );

    const json = await response.json();
    const shopId = json.data?.shop?.id;

    if (!shopId) throw new Error("Shop ID alınamadı.");
    return shopId as string;
  }

  private static async upsertShopMetafield(admin: AdminApiContext, ownerId: string, value: string) {
    const response = await admin.graphql(
      `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id namespace key }
          userErrors { field message }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              ownerId,
              namespace: this.METAFIELD_NAMESPACE,
              key: this.METAFIELD_KEY,
              type: this.METAFIELD_TYPE,
              value,
            },
          ],
        },
      }
    );

    const json = await response.json();
    const errors = json.data?.metafieldsSet?.userErrors ?? [];

    if (errors.length > 0) {
      console.error("Metafield hataları:", errors);
      throw new Error("Metafield senkronizasyonu başarısız.");
    }
  }

  private static async getMainThemeSettingsDataJson(
    admin: AdminApiContext
  ): Promise<string | null> {
    const response = await admin.graphql(
      `#graphql
      query GetMainThemeAndSettingsData($filenames: [String!]!) {
        themes(first: 10, roles: [MAIN]) {
          edges {
            node {
              id
              files(filenames: $filenames, first: 1) {
                nodes {
                  filename
                  body {
                    ... on OnlineStoreThemeFileBodyText { content }
                  }
                }
              }
            }
          }
        }
      }`,
      { variables: { filenames: [this.THEME_SETTINGS_FILE] } }
    );

    const json = await response.json();
    const mainTheme = json.data?.themes?.edges?.[0]?.node;
    const file = mainTheme?.files?.nodes?.find((f) => f.filename === this.THEME_SETTINGS_FILE);

    return file?.body?.content ?? null;
  }

  private static detectAppEmbedStatus(settingsData: any, apiKey: string): ThemeExtensionStatus {
    const blocks = settingsData?.current?.blocks ?? {};
    const typePrefix = `shopify://apps/vivollo/blocks/${this.BLOCK_HANDLE}/`;

    for (const block of Object.values(blocks) as any[]) {
      const type: unknown = block?.type;
      if (typeof type === "string" && type.includes(typePrefix)) {
        return block?.disabled ? "disabled" : "active";
      }
    }

    return "not_installed";
  }

  private static buildThemeEditorDeepLink(shop: string, apiKey: string) {
    return `https://${shop}/admin/themes/current/editor?context=apps&template=index&activateAppId=${apiKey}/${this.BLOCK_HANDLE}`;
  }

  private static safeJsonParse<T = any>(value: string): T | null {
    try {
      return parseJsonc(value) as T;
    } catch (e) {
      console.error("JSONC parse hatası:", e);
      return null;
    }
  }
}
