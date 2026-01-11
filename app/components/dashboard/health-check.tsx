import { CollectionGroup } from "app/types/vivollo.types";

type HealthCheckProps = {
  collectionGroups: { data: CollectionGroup[] };
  hasPublishedWidget: boolean;
};

export function HealthCheck({ collectionGroups, hasPublishedWidget }: HealthCheckProps) {
  const syncedProductsCount = collectionGroups.data.reduce(
    (acc, group) => acc + group.default_documents_count,
    0
  );

  return (
    <s-grid gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="base">
      {/* Metric 1 */}
      <s-clickable
        href="/app/settings"
        border="base"
        borderRadius="base"
        padding="base"
        background="base"
      >
        <s-grid gap="small-300">
          <s-heading>Widget Status</s-heading>
          <s-stack direction="inline" gap="small-200">
            <s-badge tone={hasPublishedWidget ? "success" : "critical"}>
              {hasPublishedWidget ? "Active" : "Inactive"}
            </s-badge>
          </s-stack>
        </s-grid>
      </s-clickable>

      {/* Metric 2 */}
      <s-clickable
        href="/app/collections"
        border="base"
        borderRadius="base"
        padding="base"
        background="base"
      >
        <s-grid gap="small-300">
          <s-heading>Products / Pages Synced</s-heading>
          <s-stack direction="inline" gap="small-200">
            <s-text>{syncedProductsCount}</s-text>
            {syncedProductsCount > 0 ? (
              <s-badge tone="success">Synced</s-badge>
            ) : (
              <s-badge tone="neutral">Manual Sync Required</s-badge>
            )}
          </s-stack>
        </s-grid>
      </s-clickable>
    </s-grid>
  );
}
