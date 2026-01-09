import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { DashboardBanner } from "../components/dashboard/dashboard-banner";
import { SetupGuide } from "../components/dashboard/setup-guide";
import { DashboardMetrics } from "../components/dashboard/dashboard-metrics";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Index() {
  const { shop } = useLoaderData<typeof loader>();
  const [showBanner, setShowBanner] = useState(true);
  const [showGuide, setShowGuide] = useState(true);

  return (
    <s-page heading="Vivollo">
      <s-button slot="primary-action">Go to Storefront</s-button>
      <s-button slot="secondary-actions">Help Center</s-button>

      {showBanner && (
        <DashboardBanner onDismiss={() => setShowBanner(false)} />
      )}

      {showGuide && (
        <SetupGuide
          shopDomain={shop}
          isVisible={showGuide}
          onDismiss={() => setShowGuide(false)}
        />
      )}

      <DashboardMetrics />

    </s-page>
  );
}
