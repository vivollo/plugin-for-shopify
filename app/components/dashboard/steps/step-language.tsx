import { SetupStepWrapper } from "./setup-step-wrapper";

interface StepLanguageProps {
    isCompleted: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onMarkComplete: (checked: boolean) => void;
    language: string;
    onLanguageChange: (lang: string) => void;
    onSave: () => void;
}

export function StepLanguage({
    isCompleted,
    isExpanded,
    onToggle,
    onMarkComplete,
    language,
    onLanguageChange,
    onSave,
}: StepLanguageProps) {
    return (
        <SetupStepWrapper
            label="Select Widget Language"
            isCompleted={isCompleted}
            isExpanded={isExpanded}
            onToggle={onToggle}
            onMarkComplete={onMarkComplete}
        >
            <s-grid gap="small-200">
                <s-paragraph>
                    Choose the primary language for your widget. This determines the default conversation flow.
                </s-paragraph>

                <div style={{ maxWidth: "300px" }}>
                    <select
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #c9cccf",
                        }}
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                    >
                        <option value="tr">Turkish (Türkçe)</option>
                        <option value="en">English (İngilizce)</option>
                    </select>
                </div>

                <s-stack direction="inline" gap="small-200">
                    <s-button variant="primary" onClick={onSave}>
                        Save & Continue
                    </s-button>
                </s-stack>
            </s-grid>
        </SetupStepWrapper>
    );
}
