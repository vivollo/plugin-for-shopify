import { WidgetService } from "app/services/widget.server";
import { authenticate } from "app/shopify.server";
import { ActionFunctionArgs } from "react-router";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);

  try {
    await WidgetService.publishWidget(session.id, admin);
  } catch (error: any) {
    console.error("Publish widget error:", error);

    if (error.message.includes("channelId")) {
      // In a real app we might want to return this error to the UI
      console.error("Critical: Missing channelId. User should reinstall.");
    }

    return { status: "error", message: error.message };
  }
};
