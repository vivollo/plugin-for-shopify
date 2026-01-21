import prisma from "app/db.server";
import api from "./api.server";
import { Session } from "@shopify/shopify-app-react-router/server";
import { Prisma, Session as DbSession } from "@prisma/client";
import { isAfter, parseISO, subSeconds } from "date-fns";

export class SessionService {
	static async findById(id: string) {
		return await prisma.session.findUnique({ where: { id } });
	}

	static async findByIdOrFail(id: string) {
		const session = await this.findById(id);
		if (!session) throw new Error(`Session not found: ${id}`);
		return session;
	}

	static async update(id: string, data: any) {
		return await prisma.session.update({ where: { id }, data });
	}

	static async syncToken(session: Session) {
		const response = await api.post("/integrations/shopify/install", {
			shop: session.shop,
			access_token: session.accessToken,
			access_token_expires_at: session.expires,
			refresh_token: session.refreshToken,
			refresh_token_expires_at: session.refreshTokenExpires,
		});

		const { tenant, channel_id, access_token } = response.data;

		let expiresAt = null;
		if (access_token) {
			try {
				const payload = JSON.parse(
					Buffer.from(access_token.split(".")[1], "base64").toString(),
				);
				if (payload.exp) {
					expiresAt = new Date(payload.exp * 1000);
				}
			} catch (e) {
				console.error("Failed to parse JWT expiration:", e);
			}
		}

		await prisma.session.updateMany({
			where: { shop: session.shop },
			data: {
				tenantName: tenant,
				channelId: channel_id,
				vivolloAccessToken: access_token,
				vivolloAccessTokenExpires: expiresAt,
			},
		});

		return await this.findByIdOrFail(session.id);
	}

	static async isTokenValid(session: DbSession) {
		const expiresAt = session.vivolloAccessTokenExpires;
		const nowWithSkew = subSeconds(new Date(), 60); // 60sn buffer

		return (
			!!session.vivolloAccessToken &&
			!!session.tenantName &&
			!!expiresAt &&
			isAfter(expiresAt, nowWithSkew)
		);
	}
}
