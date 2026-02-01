import { RouteShorthandOptions } from "fastify";
import { authenticate, errorResponseSchema } from "@core/index.js";

const declineInvitationSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema: {
		description: "Decline a game invitation",
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
					data: { type: "object", properties: { status: { type: "string", enum: ["declined"] } } },
					message: { type: "string" }
				}
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			403: errorResponseSchema,
			404: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default declineInvitationSchema;
