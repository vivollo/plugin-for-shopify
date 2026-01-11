import { CollectionListItem } from "app/components/collections/collection-list-item";
import { CollectionService } from "app/services/collection.server";
import { SessionService } from "app/services/session.server";
import { authenticate } from "app/shopify.server";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const dbSession = await SessionService.findByIdOrFail(session.id);

  if (!dbSession.vivolloAccessToken || !dbSession.tenantName) {
    throw new Error("Missing Vivollo credentials");
  }

  const collectionGroups = await CollectionService.getCollectionGroups(
    dbSession.vivolloAccessToken,
    dbSession.tenantName
  );

  return {
    shop: session.shop,
    collectionGroups,
  };
};

export default function CollectionsPage() {
  const { collectionGroups } = useLoaderData<typeof loader>();

  return (
    <s-page heading="Collections" inlineSize="small">
      <s-stack gap="base">
        {collectionGroups.data.map((collectionGroup: any) => (
          <CollectionListItem key={collectionGroup.id} collectionGroup={collectionGroup} />
        ))}
      </s-stack>
    </s-page>
  );
}
