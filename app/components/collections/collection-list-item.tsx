import { useAppBridge } from "@shopify/app-bridge-react";
import { CollectionGroup } from "app/types/vivollo.types";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useFetcher, useRevalidator } from "react-router";

type SyncResponse =
  | { success: true; message?: string }
  | { success: false; error: string }
  | undefined;

type CollectionListItemProps = {
  collectionGroup: CollectionGroup;
};

/**
 * To ensure the fetcher handles only "this item's" request:
 * - Set activeRequestId on submit
 * - Show toast on idle if activeRequestId matches
 * This prevents duplicate toasts and ensures proper scoping.
 */
export const CollectionListItem: FC<CollectionListItemProps> = ({ collectionGroup }) => {
  const fetcher = useFetcher<SyncResponse>();
  const appBridge = useAppBridge();
  const revalidator = useRevalidator();

  // Tracks the last sync request initiated by this component instance
  const activeRequestIdRef = useRef<string | null>(null);

  const collectionGroupId = useMemo(() => String(collectionGroup.id), [collectionGroup.id]);

  const isLocked = Boolean(collectionGroup.is_collector_locked);

  const isBusy = fetcher.state !== "idle";

  // Is the fetcher busy with a request initiated by this component?
  const isSyncingThisItem = Boolean(activeRequestIdRef.current) && isBusy;

  const canSync = !isLocked && !isBusy;

  const handleSync = useCallback(() => {
    if (!canSync) return;

    // Lock the item ID for this instance's request
    activeRequestIdRef.current = collectionGroupId;

    fetcher.submit({ collectionGroupId }, { method: "post", action: "/api/sync-collection" });
  }, [canSync, collectionGroupId, fetcher]);

  /**
   * Handle toast notifications:
   * - Evaluate only when fetcher is idle and matches activeRequestId
   * - Clear activeRequestId to prevent duplicate toasts
   */
  useEffect(() => {
    if (fetcher.state !== "idle") return;

    // If no request was initiated by this component, do nothing
    if (activeRequestIdRef.current !== collectionGroupId) return;

    const data = fetcher.data;

    if (data) {
      if (data.success) {
        appBridge.toast.show("Sync started in background.");
      } else if (data.success === false) {
        appBridge.toast.show(data.error || "Sync failed.", { isError: true });
      }
    }

    // Request processed, prevent duplicate toasts
    activeRequestIdRef.current = null;
  }, [appBridge.toast, collectionGroupId, fetcher.data, fetcher.state]);

  // Poll while locked
  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      if (revalidator.state === "idle") {
        revalidator.revalidate();
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [isLocked, revalidator]);

  return (
    <s-section padding="base" accessibilityLabel={collectionGroup.name}>
      <s-stack gap="base">
        <s-stack>
          <s-heading accessibilityRole="heading">{collectionGroup.name}</s-heading>

          {collectionGroup.description ? (
            <s-paragraph color="subdued">{collectionGroup.description}</s-paragraph>
          ) : null}
        </s-stack>

        <s-divider />

        <s-stack direction="inline" justifyContent="space-between" alignItems="center">
          <s-stack>
            <s-text color="subdued">Synced documents</s-text>
            <s-heading>
              {canSync ? `${collectionGroup.default_documents_count} documents` : "Syncing..."}
            </s-heading>
          </s-stack>

          <s-stack direction="inline" gap="small-200" alignItems="center">
            <s-button
              variant="primary"
              onClick={handleSync}
              loading={isSyncingThisItem}
              disabled={!canSync}
            >
              Sync
            </s-button>
          </s-stack>
        </s-stack>
      </s-stack>
    </s-section>
  );
};
