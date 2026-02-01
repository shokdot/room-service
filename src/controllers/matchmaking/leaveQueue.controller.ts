import { FastifyReply } from 'fastify';
import { leaveMatchmakingQueue } from '@services/index.js';
import { sendError, AuthRequest, AppError } from '@core/index.js';

const leaveQueueHandler = async (request: AuthRequest, reply: FastifyReply) => {
	try {
		const { userId } = request;

		leaveMatchmakingQueue(userId);

		return reply.status(200).send({
			status: 'success',
			message: 'Left matchmaking queue'
		});
	} catch (error: unknown) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default leaveQueueHandler;
