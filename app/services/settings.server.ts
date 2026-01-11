import { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import prisma from "../db.server";
import { WidgetService } from "./widget.server";
import { SessionService } from "./session.server";

export type DisplayPosition = "hidden" | "left" | "right";

export interface WidgetSettings {
  companyName: string;
  displayPosition: DisplayPosition;
  popupMessage: string;
  primaryColor: string;
  logoUrl: string;
}

export const DEFAULT_SETTINGS: WidgetSettings = {
  companyName: "Vivollo",
  displayPosition: "right",
  popupMessage: "Hello! How can I help you?",
  primaryColor: "#2F80ED",
  logoUrl: "",
};

export class SettingsService {
  static async getSettings(sessionId: string): Promise<WidgetSettings> {
    const dbSession = await SessionService.findByIdOrFail(sessionId);

    let settings = { ...DEFAULT_SETTINGS };

    if (dbSession?.widgetSettings) {
      try {
        settings = { ...settings, ...JSON.parse(dbSession.widgetSettings) };
      } catch (e) {
        console.error("Error parsing widget settings", e);
      }
    }

    return settings;
  }

  static async updateSettings(sessionId: string, settings: WidgetSettings, admin: AdminApiContext) {
    await SessionService.update(sessionId, {
      widgetSettings: JSON.stringify(settings),
      hasCustomizedWidget: true,
    });

    WidgetService.publishWidget(sessionId, admin);
  }
}
