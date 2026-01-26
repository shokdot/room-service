import { RouteShorthandOptions } from "fastify";
import { authenticate, errorResponseSchema } from "@core/index.js";

const deleteRoomSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema:
	{
		description: "Delete a room",
		tags: ["Room"],
		security: [{ bearerAuth: [] }],
		params: {
			type: 'object',
			required: ['roomId'],
			additionalProperties: false,
			properties: {
				roomId: {
					type: 'string',
					description: 'Room ID to delete'
				}
			}
		},
		response: {
			200: {
				type: 'object',
				required: ['status', 'message'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					message: { type: 'string' }
				},
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			403: errorResponseSchema,
			404: errorResponseSchema,
			500: errorResponseSchema
		},
	},
};

export default deleteRoomSchema;
