import { useState } from "react";
import { useNavigate, useSubmit } from "react-router";

interface OnboardingChecklistProps {
  shop: string;
  hasCustomizedWidget: boolean;
  hasPublishedWidget: boolean;
  hasSyncedProducts: boolean;
  extensionDeepLink: string | null;
}

export function OnboardingChecklist({
  shop,
  hasCustomizedWidget,
  hasPublishedWidget,
  hasSyncedProducts,
  extensionDeepLink,
}: OnboardingChecklistProps) {
  const navigate = useNavigate();
  const submit = useSubmit();

  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!extensionDeepLink) return;

    setLoading(true);

    await submit({}, { method: "post", action: "/api/publish-widget" });
    window.open(extensionDeepLink, "_blank");

    setLoading(false);
  };

  const isComplete = hasCustomizedWidget && hasPublishedWidget && hasSyncedProducts;

  if (isComplete) {
    return null;
  }

  return (
    <s-section>
      <s-grid gap="base">
        <s-grid gap="small-200">
          <s-heading>Getting started</s-heading>
          <s-paragraph color="subdued">
            Finish these steps to get Vivollo up and running on {shop}.
          </s-paragraph>
        </s-grid>

        <s-box borderRadius="base" background="base">
          <s-stack gap="base">
            {/* Step 1: Widget customization */}
            <s-stack direction="inline" alignItems="center" justifyContent="space-between">
              <s-stack direction="inline" gap="small-200" alignItems="start">
                <s-icon
                  type={hasCustomizedWidget ? "check-circle" : "alert-circle"}
                  tone={hasCustomizedWidget ? "success" : "neutral"}
                />
                <s-stack>
                  <s-heading>Widget customizations</s-heading>
                  <s-paragraph color="subdued">
                    Customize popup message, color, and icon.
                  </s-paragraph>
                </s-stack>
              </s-stack>

              {hasCustomizedWidget ? (
                <s-badge tone="success">Completed</s-badge>
              ) : (
                <s-button variant="secondary" onClick={() => navigate("/app/settings")}>
                  Customize
                </s-button>
              )}
            </s-stack>

            <s-divider />

            {/* Step 2: Publish widget */}
            <s-stack direction="inline" alignItems="center" justifyContent="space-between">
              <s-stack direction="inline" gap="small-200" alignItems="start">
                <s-icon
                  type={hasPublishedWidget ? "check-circle" : "alert-circle"}
                  tone={hasPublishedWidget ? "success" : "neutral"}
                />
                <s-stack>
                  <s-heading>Publish widget to store</s-heading>
                  <s-paragraph color="subdued">Enable the widget on your storefront.</s-paragraph>
                </s-stack>
              </s-stack>

              {hasPublishedWidget ? (
                <s-badge tone="success">Active</s-badge>
              ) : (
                <s-button variant="secondary" onClick={handlePublish} loading={loading}>
                  Enable in Theme
                </s-button>
              )}
            </s-stack>

            <s-divider />

            {/* Step 3: Product synchronization */}
            <s-stack direction="inline" alignItems="center" justifyContent="space-between">
              <s-stack direction="inline" gap="small-200" alignItems="start">
                <s-icon
                  type={hasSyncedProducts ? "check-circle" : "alert-circle"}
                  tone={hasSyncedProducts ? "success" : "neutral"}
                />
                <s-stack>
                  <s-heading>Product synchronization</s-heading>
                  <s-paragraph color="subdued">Sync your products with Vivollo.</s-paragraph>
                </s-stack>
              </s-stack>

              {hasSyncedProducts ? (
                <s-badge tone="success">Completed</s-badge>
              ) : (
                <s-button href="/app/collections" variant="secondary">
                  Sync products
                </s-button>
              )}
            </s-stack>
          </s-stack>
        </s-box>
      </s-grid>
    </s-section>
  );
}
