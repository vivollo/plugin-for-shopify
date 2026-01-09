import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import api from "../services/api.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await authenticate.admin(request);

    console.log(`[Debug] Manually triggering sync-token for ${session.shop}`);

    try {
        const response = await api.post("/integrations/shopify/install", {
            shop: session.shop,
            access_token: session.accessToken,
            access_token_expires_at: session.expires,
            refresh_token: session.refreshToken,
            refresh_token_expires_at: session.refreshTokenExpires,
        });

        return {
            status: "success",
            shop: session.shop,
            scope: session.scope,
            laravel_response: response.data,
            timestamp: new Date().toISOString(),
            message: undefined,
            response_data: undefined,
            response_status: response.status,
        };
    } catch (error: any) {
        console.error("[Debug] Sync failed:", error);
        // In React Router v7, you can throw data to the error boundary, 
        // or return error data. Returning standard object here for simplicity in the UI.
        return {
            status: "error",
            shop: session.shop,
            scope: session.scope,
            laravel_response: undefined,
            timestamp: new Date().toISOString(),
            message: error.message || "Unknown error",
            response_data: error.response?.data,
            response_status: error.response?.status || 500,
        };
    }
};

export default function DebugSync() {
    const data = useLoaderData<typeof loader>();

    if (!data) return <div>Loading...</div>;

    return (
        <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
            <h1>Manual Sync Trigger (Debug)</h1>
            <p>Simulating 'afterAuth' hook for: <strong>{data.shop}</strong></p>

            <div style={{
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: data.status === "success" ? "#dcfce7" : "#fee2e2",
                border: `1px solid ${data.status === "success" ? "#86efac" : "#fca5a5"}`,
                color: data.status === "success" ? "#14532d" : "#7f1d1d"
            }}>
                <h2>Result: {data.status?.toUpperCase()}</h2>

                {data.status === "error" && (
                    <div>
                        <p><strong>Error Message:</strong> {data.message}</p>
                        {data.response_status && <p><strong>Status Code:</strong> {data.response_status}</p>}
                    </div>
                )}

                <h3>Laravel Response Data:</h3>
                <pre style={{
                    background: "rgba(0,0,0,0.05)",
                    padding: "1rem",
                    borderRadius: "4px",
                    overflowX: "auto"
                }}>
                    {JSON.stringify(data.status === "success" ? data.laravel_response : data.response_data, null, 2)}
                </pre>
            </div>

            <button
                onClick={() => window.location.reload()}
                style={{
                    marginTop: "2rem",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                Trigger Again
            </button>
        </div>
    );
}
