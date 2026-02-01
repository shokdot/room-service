import { RouteShorthandOptions } from "fastify";
import { authenticate, errorResponseSchema } from "@core/index.js";

const acceptInvitationSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema: {
		description: "Accept a game invitation; creates room and game",
		tags: ["Invitation"],
		security: [{ bearerAuth: [] }],
		params: {
			type: "object",
			required: ["invitationId"],
			additionalProperties: false,
			properties: {
				invitationId: { type: "string", format: "uuid" }
			}
		},
		response: {
			200: {
				type: "object",
				required: ["status", "data", "message"],
				additionalProperties: false,
				properties: {
					status: { type: "string", enum: ["success"] },
					data: {
						type: "object",
						required: ["roomId", "gameId"],
						additionalProperties: false,
						properties: {
							roomId: { type: "string", format: "uuid" },
							gameId: { type: "string", format: "uuid" }
						}
					},
					message: { type: "string" }
				}
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			403: errorResponseSchema,
			404: errorResponseSchema,
			409: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default acceptInvitationSchema;
