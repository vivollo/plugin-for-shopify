import { SetupStepWrapper } from "./setup-step-wrapper";

interface StepAppearanceProps {
    isCompleted: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onMarkComplete: (checked: boolean) => void;
    teaserMessage: string;
    onTeaserChange: (val: string) => void;
    primaryColor: string;
    onColorChange: (val: string) => void;
    onSave: () => void;
}

export function StepAppearance({
    isCompleted,
    isExpanded,
    onToggle,
    onMarkComplete,
    teaserMessage,
    onTeaserChange,
    primaryColor,
    onColorChange,
    onSave,
}: StepAppearanceProps) {
    return (
        <SetupStepWrapper
            label="Customize Widget Appearance"
            isCompleted={isCompleted}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onMarkComplete={onMarkComplete}
        >
            <s-grid gap="small-400">
                <s-paragraph>
                    Set your initial greeting messages and brand color.
                </s-paragraph>

                <s-grid columns={{ sm: 1, md: 2 }} gap="base">
                    <s-box>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "4px",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        >
                            Popup Message
                        </label>
                        <input
                            type="text"
                            value={teaserMessage}
                            onChange={(e) => onTeaserChange(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "6px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />
                    </s-box>
                    <s-box>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "4px",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        >
                            Primary Color
                        </label>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => onColorChange(e.target.value)}
                                style={{
                                    height: "36px",
                                    width: "36px",
                                    border: "none",
                                    padding: 0,
                                }}
                            />
                            <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => onColorChange(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                    </s-box>
                </s-grid>

                <s-stack direction="inline">
                    <s-button variant="primary" onClick={onSave}>
                        Save Appearance
                    </s-button>
                </s-stack>
            </s-grid>
        </SetupStepWrapper>
    );
}
