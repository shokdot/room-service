import { RouteShorthandOptions } from "fastify";
import { authenticate, errorResponseSchema } from "@core/index.js";

const getRoomsSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema:
	{
		description: "Get all rooms or available rooms",
		tags: ["Room"],
		security: [{ bearerAuth: [] }],
		querystring: {
			type: 'object',
			required: [],
			additionalProperties: false,
			properties: {
				available: {
					type: 'string',
					enum: ['true', 'false'],
					description: 'Filter to show only available rooms (true) or all rooms (false/omitted)'
				}
			}
		},
		response: {
			200: {
				type: 'object',
				required: ['status', 'data', 'count'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					data: {
						type: 'array',
						items: {
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
						}
					},
					count: { type: 'number', description: 'Number of rooms returned' }
				},
			},
			400: errorResponseSchema,
			401: errorResponseSchema,
			500: errorResponseSchema
		},
	},
};

export default getRoomsSchema;
