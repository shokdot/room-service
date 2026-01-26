import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema } from "@core/index.js";
import { authenticate } from "@core/index.js";

const createRoomSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema:
	{
		description: "Create a new game room",
		tags: ["Room"],
		security: [{ bearerAuth: [] }],
		body: {
			type: 'object',
			required: [],
			additionalProperties: false,
			properties: {
				winScore: {
					type: 'number',
					minimum: 1,
					maximum: 30,
					description: 'Score needed to win the game (optional, default varies)'
				}
			}
		},
		response: {
			201: {
				type: 'object',
				required: ['status', 'data', 'message'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					data: {
						type: 'object',
						required: ['id', 'createdBy', 'createdAt', 'status', 'players'],
						additionalProperties: false,
						properties: {
							id: { type: 'string', description: 'Room ID' },
							createdBy: { type: 'string', format: 'uuid', description: 'User ID of room creator' },
							createdAt: { type: 'string', format: 'date-time', description: 'Room creation timestamp' },
							status: { type: 'string', enum: ['waiting', 'playing', 'finished'], description: 'Room status' },
							players: {
								type: 'array',
								items: { type: 'string', format: 'uuid' },
								description: 'Array of player user IDs'
							},
							winScore: { type: ['number', 'null'], description: 'Score needed to win the game' }
						}
					},
					message: { type: 'string' }
				},
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			500: errorResponseSchema
		},
	},
};

export default createRoomSchema;
