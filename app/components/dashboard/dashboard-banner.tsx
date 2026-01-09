interface DashboardBannerProps {
    onDismiss: () => void;
}

export function DashboardBanner({ onDismiss }: DashboardBannerProps) {
    return (
        <s-banner
            dismissible
            onDismiss={onDismiss}
            tone="info"
        >
            Welcome to Vivollo! Complete the setup guide below to get your chatbot up and running.
        </s-banner>
    );
}
