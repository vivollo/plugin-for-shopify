import { CollectionListItem } from "app/components/collections/collection-list-item";
import { CollectionService } from "app/services/collection.server";
import { SessionService } from "app/services/session.server";
import { SlackService } from "app/services/slack.server";
import { authenticate } from "app/shopify.server";
import { Await, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { Suspense } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const dbSession = await SessionService.findByIdOrFail(session.id);

  if (!dbSession.vivolloAccessToken || !dbSession.tenantName) {
    throw new Error("Missing Vivollo credentials");
  }

  SlackService.sendMessage("Test message");

  const collectionGroupsPromise = CollectionService.getCollectionGroups(
    dbSession.vivolloAccessToken,
    dbSession.tenantName
  );

  return {
    shop: session.shop,
    collectionGroups: collectionGroupsPromise,
  };
};

export default function CollectionsPage() {
  const { collectionGroups } = useLoaderData<typeof loader>();

  return (
    <s-page heading="Collections" inlineSize="small">
      <Suspense fallback={<s-paragraph>Loading collections...</s-paragraph>}>
        <Await resolve={collectionGroups}>
          {(collectionGroupsData) => (
            <s-stack gap="base">
              {collectionGroupsData.data.map((collectionGroup: any) => (
                <CollectionListItem key={collectionGroup.id} collectionGroup={collectionGroup} />
              ))}
            </s-stack>
          )}
        </Await>
      </Suspense>
    </s-page>
  );
}
