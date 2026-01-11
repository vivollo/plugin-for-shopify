import { authenticate } from "app/shopify.server";
import { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const appHandle = "vivollo";

  const { billing, redirect, session } = await authenticate.admin(request);

  const { hasActivePayment } = await billing.check();
  const shop = session.shop;
  const storeHandle = shop.replace(".myshopify.com", "");

  if (!hasActivePayment) {
    return redirect(
      `https://admin.shopify.com/store/${storeHandle}/charges/${appHandle}/pricing_plans`,
      {
        target: "_top",
      }
    );
  }

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
  };
};

export default function PlansRedirect() {
  return null;
}
