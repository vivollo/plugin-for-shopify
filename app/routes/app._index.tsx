import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { WidgetService } from "../services/widget.server";
import { OnboardingChecklist } from "../components/dashboard/onboarding-checklist";
import { CollectionService } from "app/services/collection.server";
import { SessionService } from "app/services/session.server";
import { ReportsService } from "app/services/reports.server";
import { HealthCheck } from "app/components/dashboard/health-check";
import { DashboardMetrics } from "app/components/dashboard/dashboard-metrics";
import { format } from "date-fns";
import { LoginVivolloButton } from "app/components/dashboard/login-vivollo-button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const dbSession = await SessionService.findByIdOrFail(session.id);

  if (!dbSession.vivolloAccessToken || !dbSession.tenantName) {
    throw new Error("Missing Vivollo credentials");
  }

  const fromDate = new Date().setDate(new Date().getDate() - 7);
  const toDate = new Date().setDate(new Date().getDate() - 1);

  const [onboardingStatus, collectionGroups, reportsOverview] = await Promise.all([
    WidgetService.getOnboardingStatus(admin, session.id, session.shop),
    CollectionService.getCollectionGroups(dbSession.vivolloAccessToken, dbSession.tenantName),
    ReportsService.getOverview(
      dbSession.vivolloAccessToken,
      dbSession.tenantName,
      format(fromDate, "yyyy-MM-dd"),
      format(toDate, "yyyy-MM-dd")
    ),
  ]);

  return {
    shop: session.shop,
    onboardingStatus,
    collectionGroups,
    reportsOverview,
  };
};

export default function Index() {
  const { shop, collectionGroups, onboardingStatus, reportsOverview } =
    useLoaderData<typeof loader>();

  return (
    <s-page heading="Vivollo">
      <LoginVivolloButton />

      <s-stack gap="base">
        <OnboardingChecklist
          shop={shop}
          hasCustomizedWidget={onboardingStatus.hasCustomizedWidget}
          hasPublishedWidget={onboardingStatus.hasPublishedWidget}
          hasSyncedProducts={onboardingStatus.hasSyncedProducts}
          extensionDeepLink={onboardingStatus.extensionDeepLink}
        />

        <HealthCheck
          collectionGroups={collectionGroups}
          hasPublishedWidget={onboardingStatus.hasPublishedWidget}
        />

        <DashboardMetrics reports={reportsOverview.reports} />
      </s-stack>
    </s-page>
  );
}
