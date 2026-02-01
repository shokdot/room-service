import { RouteShorthandOptions } from 'fastify';
import { authenticate, errorResponseSchema } from '@core/index.js';

const leaveQueueSchema: RouteShorthandOptions = {
	preHandler: [authenticate as any],
	schema: {
		description: 'Leave the matchmaking queue',
		tags: ['Matchmaking'],
		security: [{ bearerAuth: [] }],
		response: {
			200: {
				type: 'object',
				required: ['status', 'message'],
				additionalProperties: false,
				properties: {
					status: { type: 'string', enum: ['success'] },
					message: { type: 'string' }
				}
			},
			401: errorResponseSchema,
			403: errorResponseSchema,
			500: errorResponseSchema
		}
	}
};

export default leaveQueueSchema;
