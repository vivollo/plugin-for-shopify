import { CollectionListItem } from "app/components/collections/collection-list-item";
import { CollectionService } from "app/services/collection.server";
import { SessionService } from "app/services/session.server";
import { authenticate } from "app/shopify.server";
import { Await, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { Suspense } from "react";
import { Route } from "./+types/app.collections";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { session } = await authenticate.admin(request);
	const dbSession = await SessionService.findByIdOrFail(session.id);

	if (!dbSession.vivolloAccessToken || !dbSession.tenantName) {
		throw new Error("Missing Vivollo credentials");
	}

	const collectionGroupsPromise = CollectionService.getCollectionGroups(
		dbSession.vivolloAccessToken,
		dbSession.tenantName,
	);

	return {
		shop: session.shop,
		collectionGroups: collectionGroupsPromise,
	};
};

export default function CollectionsPage({ loaderData }: Route.ComponentProps) {
	const { collectionGroups } = loaderData;

	return (
		<s-page heading="Collections" inlineSize="small">
			<Suspense fallback={<CollectionListItem.Skeleton />}>
				<Await resolve={collectionGroups}>
					{(collectionGroupsData) => (
						<s-stack gap="base">
							{collectionGroupsData.data.map((collectionGroup: any) => (
								<CollectionListItem
									key={collectionGroup.id}
									collectionGroup={collectionGroup}
								/>
							))}
						</s-stack>
					)}
				</Await>
			</Suspense>
		</s-page>
	);
}
