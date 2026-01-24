import { RouteShorthandOptions } from "fastify";
import { errorResponseSchema, serviceAuth } from "@core/index.js";

const finishRoomSchema: RouteShorthandOptions = {
	preHandler: [serviceAuth as any],
	schema:
	{
		description: "Finish a room with game results (internal service call)",
		tags: ["Internal"],
		security: [{ serviceToken: [] }],
		params: {
			type: 'object',
			required: ['roomId'],
			additionalProperties: false,
			properties: {
				roomId: {
					type: 'string',
					description: 'Room ID to finish'
				}
			}
		},
		body: {
			type: 'object',
			required: ['winner', 'finalScore', 'gameDuration', 'startTime', 'endTime', 'players'],
			additionalProperties: false,
			properties: {
				winner: {
					type: 'number',
					enum: [0, 1],
					description: 'Winner index (0 for player1, 1 for player2)'
				},
				finalScore: {
					type: 'object',
					required: ['player1', 'player2'],
					additionalProperties: false,
					properties: {
						player1: { type: 'number', description: 'Final score of player 1' },
						player2: { type: 'number', description: 'Final score of player 2' }
					}
				},
				gameDuration: {
					type: 'number',
					description: 'Game duration in milliseconds'
				},
				startTime: {
					type: 'string',
					format: 'date-time',
					description: 'Game start timestamp'
				},
				endTime: {
					type: 'string',
					format: 'date-time',
					description: 'Game end timestamp'
				},
				players: {
					type: 'array',
					items: {
						type: 'object',
						required: ['userId', 'playerNumber'],
						additionalProperties: false,
						properties: {
							userId: { type: 'string', format: 'uuid', description: 'User ID' },
							playerNumber: { type: 'number', enum: [0, 1], description: 'Player number (0 or 1)' }
						}
					},
					minItems: 2,
					maxItems: 2,
					description: 'Array of players with their numbers'
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

export default finishRoomSchema;
