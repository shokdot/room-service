import { RouteShorthandOptions } from 'fastify';
import { authenticate, errorResponseSchema } from '@core/index.js';

const enterQueueSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema: {
		description: 'Enter the matchmaking queue',
		tags: ['Matchmaking'],
		security: [{ bearerAuth: [] }],
		response: {
			200: {
				type: 'object',
				required: ['status', 'data', 'message'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					data: {
						type: 'object',
						required: ['matched', 'roomId'],
						additionalProperties: false,
						properties: {
							matched: { type: 'boolean', description: 'Whether a match was found' },
							roomId: { type: ['string', 'null'], description: 'Room ID when matched' }
						}
					},
					message: { type: 'string' }
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

export default enterQueueSchema;
