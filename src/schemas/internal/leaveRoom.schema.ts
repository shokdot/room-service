import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, serviceAuth } from "@core/index.js";

const leaveRoomSchema: RouteShorthandOptions = {
	preHandler: [serviceAuth as any],
	schema:
	{
		description: "Remove a player from a room (internal service call)",
		tags: ["Internal"],
		security: [{ serviceToken: [] }],
		params: {
			type: 'object',
			required: ['roomId'],
			additionalProperties: false,
			properties: {
				roomId: {
					type: 'string',
					description: 'Room ID'
				}
			}
		},
		body: {
			type: 'object',
			required: ['userId'],
			additionalProperties: false,
			properties: {
				userId: {
					type: 'string',
					format: 'uuid',
					description: 'User ID to remove from room'
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

export default leaveRoomSchema;
