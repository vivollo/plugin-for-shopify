import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";

type LoginActionResult =
  | { status: "success"; loginUrl: string }
  | { status: "error"; message: string }
  | undefined;

export const LoginVivolloButton = () => {
  const appBridge = useAppBridge();
  const fetcher = useFetcher<LoginActionResult>();
  const isBusy = fetcher.state !== "idle";
  const popupRef = useRef<Window | null>(null);

  const initiateLogin = () => {
    if (isBusy) return;

    // Open window immediately to avoid popup blockers
    popupRef.current = window.open("", "_blank");
    if (popupRef.current) {
      popupRef.current.document.write("Loading secure login...");
    }

    fetcher.submit({}, { method: "post", action: "/api/login-vivollo" });
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const popup = popupRef.current;

      if (fetcher.data.status === "success" && fetcher.data.loginUrl) {
        if (popup) {
          popup.location.href = fetcher.data.loginUrl;
          popupRef.current = null;
        }
      } else if (fetcher.data.status === "error") {
        appBridge.toast.show(fetcher.data.message, { isError: true });
        if (popup) {
          popup.close();
          popupRef.current = null;
        }
      }
    }
  }, [fetcher.state, fetcher.data, appBridge]);

  return (
    <s-button slot="primary-action" onClick={initiateLogin} loading={isBusy}>
      Manage in Vivollo
    </s-button>
  );
};
