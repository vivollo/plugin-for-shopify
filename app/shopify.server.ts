import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import api from "./services/api.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  customShopDomains: process.env.SHOP_CUSTOM_DOMAIN
    ? [process.env.SHOP_CUSTOM_DOMAIN]
    : undefined,
  hooks: {
    afterAuth: async ({ session }) => {
      console.log("Syncing session to Laravel API:", session.shop);

      try {
        await api.post("/integrations/shopify/install", {
          shop: session.shop,
          access_token: session.accessToken,
          access_token_expires_at: session.expires,
          refresh_token: session.refreshToken,
          refresh_token_expires_at: session.refreshTokenExpires,
        });

        console.log("Token synced successfully to Laravel");
      } catch (error) {
        console.error("Error syncing token to Laravel:", error);
      }
    },
  },
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
