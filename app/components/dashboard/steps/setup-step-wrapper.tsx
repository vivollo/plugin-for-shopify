import { ReactNode } from "react";

interface StepWrapperProps {
    label: string;
    isCompleted: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onMarkComplete: (checked: boolean) => void;
    children: ReactNode;
}

export function SetupStepWrapper({
    label,
    isCompleted,
    isExpanded,
    onToggle,
    onMarkComplete,
    children,
}: StepWrapperProps) {
    return (
        <s-box>
            <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
                <s-checkbox
                    label={label}
                    checked={isCompleted}
                    onInput={(e: any) => onMarkComplete(e.currentTarget.checked)}
                ></s-checkbox>
                <s-button
                    onClick={onToggle}
                    accessibilityLabel={`Toggle ${label} details`}
                    variant="tertiary"
                    icon={isExpanded ? "chevron-up" : "chevron-down"}
                ></s-button>
            </s-grid>
            <s-box
                padding="small"
                paddingBlockStart="none"
                display={isExpanded ? "auto" : "none"}
            >
                <s-box padding="base" background="subdued" borderRadius="base">
                    {children}
                </s-box>
            </s-box>
        </s-box>
    );
}
