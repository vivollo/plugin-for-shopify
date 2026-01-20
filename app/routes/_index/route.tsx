import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Vivollo for Shopify: AI-powered customer messaging
        </h1>
        <p className={styles.text}>
          Turn store conversations into sales with an AI agent that answers,
          qualifies, and hands off to your team when needed.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Connect Shopify store
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>AI agent in minutes</strong>. Launch a branded, knowledgeable
            assistant trained on your products and policies.
          </li>
          <li>
            <strong>Live agent handoff</strong>. Escalate complex questions to
            your team with full conversation context.
          </li>
          <li>
            <strong>Sales-ready insights</strong>. Capture intent signals and
            improve conversion from every chat.
          </li>
        </ul>
      </div>
    </div>
  );
}
