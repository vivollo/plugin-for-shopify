import { useState } from "react";
import { StepLanguage } from "./steps/step-language";
import { StepPublish } from "./steps/step-publish";
import { StepAppearance } from "./steps/step-appearance";
import { StepNext } from "./steps/step-next";

interface SetupGuideProps {
    shopDomain: string;
    isVisible: boolean;
    onDismiss: () => void;
}

export function SetupGuide({ shopDomain, isVisible, onDismiss }: SetupGuideProps) {
    const [expandedStep, setExpandedStep] = useState<string>("step1");
    const [isGuideExpanded, setIsGuideExpanded] = useState(true);

    // State for form data
    const [formData, setFormData] = useState({
        language: "tr",
        teaserMessage: "How can we help you?",
        welcomeMessage: "Hello! I am your Vivollo assistant.",
        primaryColor: "#2F80ED"
    });

    // Setup Progress Mockup
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const toggleStep = (stepKey: string) => {
        setExpandedStep((prev) => (prev === stepKey ? "" : stepKey));
    };

    const markComplete = (stepIndex: number, isComplete: boolean) => {
        const newSet = new Set(completedSteps);
        if (isComplete) newSet.add(stepIndex);
        else newSet.delete(stepIndex);
        setCompletedSteps(newSet);
    };

    const handleSaveLanguage = () => {
        markComplete(1, true);
        setExpandedStep("step2");
    };

    const handleSaveAppearance = () => {
        markComplete(3, true);
        setExpandedStep("step4");
    };

    if (!isVisible) return null;

    return (
        <s-section>
            <s-grid gap="small">
                {/* Header */}
                <s-grid gap="small-200">
                    <s-grid
                        gridTemplateColumns="1fr auto auto"
                        gap="small-300"
                        alignItems="center"
                    >
                        <s-heading>Setup Guide</s-heading>
                        <s-button
                            accessibilityLabel="Dismiss Guide"
                            onClick={onDismiss}
                            variant="tertiary"
                            tone="neutral"
                            icon="x"
                        ></s-button>
                        <s-button
                            accessibilityLabel="Toggle setup guide"
                            onClick={() => setIsGuideExpanded(!isGuideExpanded)}
                            variant="tertiary"
                            tone="neutral"
                            icon={isGuideExpanded ? "chevron-up" : "chevron-down"}
                        ></s-button>
                    </s-grid>
                    <s-paragraph>
                        Follow these steps to configure and publish your AI widget.
                    </s-paragraph>
                    <s-paragraph color="subdued">
                        {completedSteps.size} out of 4 steps completed
                    </s-paragraph>
                </s-grid>

                {/* Steps Container */}
                <s-box
                    borderRadius="base"
                    border="base"
                    background="base"
                    display={isGuideExpanded ? "auto" : "none"}
                >
                    <StepLanguage
                        isCompleted={completedSteps.has(1)}
                        isExpanded={expandedStep === "step1"}
                        onToggle={() => toggleStep("step1")}
                        onMarkComplete={(checked) => markComplete(1, checked)}
                        language={formData.language}
                        onLanguageChange={(lang) => setFormData({ ...formData, language: lang })}
                        onSave={handleSaveLanguage}
                    />

                    <s-divider />

                    <StepPublish
                        isCompleted={completedSteps.has(2)}
                        isExpanded={expandedStep === "step2"}
                        onToggle={() => toggleStep("step2")}
                        onMarkComplete={(checked) => markComplete(2, checked)}
                        shopDomain={shopDomain}
                    />

                    <s-divider />

                    <StepAppearance
                        isCompleted={completedSteps.has(3)}
                        isExpanded={expandedStep === "step3"}
                        onToggle={() => toggleStep("step3")}
                        onMarkComplete={(checked) => markComplete(3, checked)}
                        teaserMessage={formData.teaserMessage}
                        onTeaserChange={(val) => setFormData({ ...formData, teaserMessage: val })}
                        primaryColor={formData.primaryColor}
                        onColorChange={(val) => setFormData({ ...formData, primaryColor: val })}
                        onSave={handleSaveAppearance}
                    />

                    <s-divider />

                    <StepNext
                        isCompleted={completedSteps.has(4)}
                        isExpanded={expandedStep === "step4"}
                        onToggle={() => toggleStep("step4")}
                        onMarkComplete={(checked) => markComplete(4, checked)}
                    />
                </s-box>
            </s-grid>
        </s-section>
    );
}
