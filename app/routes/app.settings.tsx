import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, Form, useActionData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import { DisplayPosition, SettingsService } from "../services/settings.server";
import { WidgetService } from "app/services/widget.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await SettingsService.getSettings(session.id);
  return { settings };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);

  try {
    const formData = await request.formData();

    const widgetSettings = {
      companyName: formData.get("companyName") as string,
      displayPosition: formData.get("displayPosition") as DisplayPosition,
      popupMessage: formData.get("popupMessage") as string,
      primaryColor: formData.get("primaryColor") as string,
      logoUrl: formData.get("logoUrl") as string,
    };

    await SettingsService.updateSettings(session.id, widgetSettings, admin);
    await WidgetService.publishWidget(session.id, admin);

    return { status: "success" as const };
  } catch (error: any) {
    console.error("Error saving widget settings", error);
    let message = "We couldn't save your settings. Please try again.";

    if (error.message?.includes("channelId")) {
      message = "Missing connection details. Please try reinstalling the app.";
    }

    return {
      status: "error" as const,
      message,
    };
  }
};

export default function Settings() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const app = useAppBridge();

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [popupMessage, setPopupMessage] = useState(settings.popupMessage);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [displayPosition, setDisplayPosition] = useState(settings.displayPosition);

  useEffect(() => {
    if (actionData?.status === "success") {
      app.toast.show("Your widget settings have been updated.");
    }
  }, [actionData?.status]);

  const showError = actionData?.status === "error";

  return (
    <s-page heading="Settings" inlineSize="small">
      <s-stack gap="base">
        {showError && (
          <s-banner tone="critical" dismissible heading="Couldn't save settings">
            {actionData?.message ?? "Something went wrong. Please try again."}
          </s-banner>
        )}

        <s-section heading="Widget customization">
          <Form method="post" data-save-bar>
            <s-stack gap="base">
              <s-text-field
                name="companyName"
                label="Company name"
                value={companyName}
                onInput={(e) => setCompanyName(e.currentTarget.value)}
                details="This name will be displayed in the widget."
                required
              />

              <s-text-field
                name="popupMessage"
                label="Popup message"
                value={popupMessage}
                onInput={(e) => setPopupMessage(e.currentTarget.value)}
                details="This message appears in your onsite support widget."
                required
              />

              <s-stack gap="small-200">
                <s-color-field
                  name="primaryColor"
                  label="Primary color"
                  value={primaryColor}
                  onInput={(e) => setPrimaryColor(e.currentTarget.value)}
                  details="Used for the widget button and highlights."
                  required
                />
              </s-stack>

              <s-url-field
                name="logoUrl"
                label="Logo icon URL (128×128)"
                value={logoUrl}
                onInput={(e) => setLogoUrl(e.currentTarget.value)}
                placeholder="https://cdn.shopify.com/s/files/..."
                details="Upload your logo to Shopify Files, then paste the file URL here."
              />

              <s-choice-list
                label="Display position"
                name="displayPosition"
                details="The display position of the widget."
                values={[displayPosition]}
                onChange={(e) =>
                  setDisplayPosition((e.currentTarget.values?.[0] ?? "hidden") as DisplayPosition)
                }
              >
                <s-choice value="hidden">Hidden</s-choice>
                <s-choice value="left">Left</s-choice>
                <s-choice value="right">Right</s-choice>
              </s-choice-list>
            </s-stack>
          </Form>
        </s-section>
      </s-stack>
    </s-page>
  );
}
