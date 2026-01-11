import { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { SessionService } from "app/services/session.server";
import { getTenantUrl } from "app/lib/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const dbSession = await SessionService.findByIdOrFail(session.id);

    if (!dbSession.tenantName) {
      throw new Error("Missing tenant name");
    }

    const loginUrl = getTenantUrl(
      dbSession.tenantName,
      `/shopify/login?token=${dbSession.vivolloAccessToken}`
    );

    return { status: "success", loginUrl };
  } catch (error) {
    console.error("Failed to generate Vivollo login URL:", error);
    return { status: "error", message: "Failed to generate login URL. Please try again." };
  }
};
