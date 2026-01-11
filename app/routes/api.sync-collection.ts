import { CollectionService } from "app/services/collection.server";
import { SessionService } from "app/services/session.server";
import { WidgetService } from "app/services/widget.server";
import { authenticate } from "app/shopify.server";
import { LoaderFunctionArgs } from "react-router";

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const dbSession = await SessionService.findByIdOrFail(session.id);
  const formData = await request.formData();

  if (!dbSession.vivolloAccessToken || !dbSession.tenantName) {
    return { success: false, error: "Missing Vivollo credentials" };
  }

  const collectionGroupId = String(formData.get("collectionGroupId"));

  try {
    await CollectionService.syncCollectionGroup(
      dbSession.vivolloAccessToken,
      dbSession.tenantName,
      collectionGroupId
    );

    await WidgetService.syncProducts(session.id);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to sync collectors" };
  }
};
