import axios from "axios";

export class SlackService {
  static async sendMessage(message: string) {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: process.env.SLACK_BOT_USER_DEFAULT_CHANNEL,
        token: process.env.SLACK_BOT_USER_OAUTH_TOKEN,
        text: message,
      }
    );

    return response.data;
  }
}
