export function DashboardMetrics() {
    return (
        <s-section>
            <s-heading>At a Glance</s-heading>
            <s-grid
                gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
                gap="base"
            >
                {/* Metric 1 */}
                <s-clickable
                    href="/app/health"
                    border="base"
                    borderRadius="base"
                    padding="base"
                >
                    <s-grid gap="small-300">
                        <s-heading>Widget Status</s-heading>
                        <s-stack direction="inline" gap="small-200">
                            <s-badge tone="critical">Inactive</s-badge>
                        </s-stack>
                    </s-grid>
                </s-clickable>

                {/* Metric 2 */}
                <s-clickable
                    href="/app/sync"
                    border="base"
                    borderRadius="base"
                    padding="base"
                >
                    <s-grid gap="small-300">
                        <s-heading>Products Synced</s-heading>
                        <s-stack direction="inline" gap="small-200">
                            <s-text>0</s-text>
                            <s-badge tone="neutral">Manual Sync Required</s-badge>
                        </s-stack>
                    </s-grid>
                </s-clickable>

                {/* Metric 3 */}
                <s-clickable
                    href="/app/plans"
                    border="base"
                    borderRadius="base"
                    padding="base"
                >
                    <s-grid gap="small-300">
                        <s-heading>Current Plan</s-heading>
                        <s-stack direction="inline" gap="small-200">
                            <s-text>Free Trial</s-text>
                        </s-stack>
                    </s-grid>
                </s-clickable>
            </s-grid>
        </s-section>
    );
}
