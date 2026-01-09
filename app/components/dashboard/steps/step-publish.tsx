import { SetupStepWrapper } from "./setup-step-wrapper";

interface StepPublishProps {
    isCompleted: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onMarkComplete: (checked: boolean) => void;
    shopDomain: string;
}

export function StepPublish({
    isCompleted,
    isExpanded,
    onToggle,
    onMarkComplete,
    shopDomain,
}: StepPublishProps) {
    return (
        <SetupStepWrapper
            label="Publish Widget to Store"
            isCompleted={isCompleted}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onMarkComplete={onMarkComplete}
        >
            <s-grid
                gridTemplateColumns="1fr auto"
                gap="base"
                alignItems="center"
            >
                <s-grid gap="small-200">
                    <s-paragraph>
                        Enable the Vivollo App Embed in your theme editor to make the widget visible to customers.
                    </s-paragraph>
                    <s-stack direction="inline" gap="small-200" align="center">
                        <s-link
                            href={`https://${shopDomain}/admin/themes/current/editor?context=apps&activateAppId=vivollo`}
                            target="_blank"
                        >
                            <s-button variant="primary" icon="external">
                                Open Theme Editor
                            </s-button>
                        </s-link>
                        <s-badge tone="critical">Not Published</s-badge>
                    </s-stack>
                </s-grid>
            </s-grid>
        </SetupStepWrapper>
    );
}
