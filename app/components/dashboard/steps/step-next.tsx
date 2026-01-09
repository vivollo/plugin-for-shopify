import { SetupStepWrapper } from "./setup-step-wrapper";

interface StepNextProps {
    isCompleted: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onMarkComplete: (checked: boolean) => void;
}

export function StepNext({
    isCompleted,
    isExpanded,
    onToggle,
    onMarkComplete,
}: StepNextProps) {
    return (
        <SetupStepWrapper
            label="Explore Pro Features"
            isCompleted={isCompleted}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onMarkComplete={onMarkComplete}
        >
            <s-grid gap="base">
                <s-paragraph>
                    You're all set! Now you can sync your products or explore our plans.
                </s-paragraph>
                <s-stack direction="inline" gap="small-200">
                    <s-link href="/app/sync">
                        <s-button>Sync Products</s-button>
                    </s-link>
                    <s-link href="/app/plans">
                        <s-button variant="tertiary" tone="neutral">
                            View Plans
                        </s-button>
                    </s-link>
                </s-stack>
            </s-grid>
        </SetupStepWrapper>
    );
}
