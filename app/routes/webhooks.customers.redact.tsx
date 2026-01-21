import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { SlackService } from "app/services/slack.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const { shop, topic, payload } = await authenticate.webhook(request);

	console.log(`Received ${topic} webhook for ${shop}`);

	const prettyPayload = JSON.stringify(payload, null, 2);
	SlackService.sendMessage(
		`[Shopify App]: Customer ${shop} was redacted. ${topic}\n\`\`\`\n${prettyPayload}\n\`\`\``,
	);

	return new Response();
};
