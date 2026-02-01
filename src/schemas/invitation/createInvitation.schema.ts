import { RouteShorthandOptions } from "fastify";
import { authenticate, errorResponseSchema } from "@core/index.js";

const createInvitationSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema: {
		description: "Create a game invitation and send it to the invitee via chat",
		tags: ["Invitation"],
		security: [{ bearerAuth: [] }],
		body: {
			type: "object",
			required: ["inviteeId"],
			additionalProperties: false,
			properties: {
				inviteeId: { type: "string", format: "uuid", description: "User ID to invite" }
			}
		},
		response: {
			201: {
				type: "object",
				required: ["status", "data", "message"],
				additionalProperties: false,
				properties: {
					status: { type: "string", enum: ["success"] },
					data: {
						type: "object",
						required: ["id", "inviterId", "inviteeId", "status", "createdAt", "expiresAt"],
						additionalProperties: false,
						properties: {
							id: { type: "string", format: "uuid" },
							inviterId: { type: "string", format: "uuid" },
							inviteeId: { type: "string", format: "uuid" },
							status: { type: "string", enum: ["pending"] },
							createdAt: { type: "string", format: "date-time" },
							expiresAt: { type: "string", format: "date-time" }
						}
					},
					message: { type: "string" }
				}
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			403: errorResponseSchema,
			409: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default createInvitationSchema;
