import type { LoaderFunctionArgs } from "react-router";
import { Await } from "react-router";
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
import { Fragment } from "react/jsx-runtime";
import { Suspense } from "react";
import { Route } from "./+types/app._index";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { session, admin } = await authenticate.admin(request);
	const dbSession = await SessionService.findByIdOrFail(session.id);

	if (!dbSession.vivolloAccessToken || !dbSession.tenantName) {
		return { shop: session.shop, error: "Missing Vivollo credentials" };
	}

	const token = dbSession.vivolloAccessToken;
	const tenant = dbSession.tenantName;

	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - 7);

	const toDate = new Date();
	toDate.setDate(toDate.getDate() - 1);

	const onboardingStatus = WidgetService.getOnboardingStatus(
		admin,
		session.id,
		session.shop,
	);

	const collectionGroups = CollectionService.getCollectionGroups(token, tenant);

	const reportsOverview = ReportsService.getOverview(
		token,
		tenant,
		format(fromDate, "yyyy-MM-dd"),
		format(toDate, "yyyy-MM-dd"),
	);

	// simulate async delay
	const delay = new Promise((resolve) => setTimeout(resolve, 3000));

	return {
		shop: session.shop,
		onboardingStatus,
		collectionGroups,
		reportsOverview,
		delay,
	};
};

export default function Index({ loaderData }: Route.ComponentProps) {
	const { shop, delay, onboardingStatus, collectionGroups, reportsOverview } =
		loaderData;

	return (
		<s-page heading="Vivollo">
			<LoginVivolloButton />

			<s-stack gap="base">
				<Suspense fallback={<s-paragraph>Loading...</s-paragraph>}>
					<Await resolve={delay}>{() => <div>Delayed</div>}</Await>
				</Suspense>

				<Suspense fallback={<s-paragraph>Loading...</s-paragraph>}>
					<Await resolve={onboardingStatus}>
						{(resolvedOnboardingStatus) =>
							resolvedOnboardingStatus && (
								<Fragment>
									<OnboardingChecklist
										shop={shop}
										status={resolvedOnboardingStatus}
									/>

									<Await resolve={collectionGroups}>
										{(resolvedCollectionGroups) => (
											<HealthCheck
												collectionGroups={resolvedCollectionGroups}
												hasPublishedWidget={
													resolvedOnboardingStatus?.hasPublishedWidget
												}
											/>
										)}
									</Await>
								</Fragment>
							)
						}
					</Await>
				</Suspense>

				<Suspense fallback={<div>Loading...</div>}>
					<Await resolve={reportsOverview}>
						{(resolvedReportsOverview) => (
							<DashboardMetrics reports={resolvedReportsOverview?.reports} />
						)}
					</Await>
				</Suspense>
			</s-stack>
		</s-page>
	);
}
