import { FastifyReply } from 'fastify';
import { enterMatchmakingQueue } from '@services/index.js';
import { sendError, AuthRequest, AppError } from '@core/index.js';

const enterQueueHandler = async (request: AuthRequest, reply: FastifyReply) => {
	try {
		const { userId } = request;

		const { matched, roomId } = await enterMatchmakingQueue(userId);

		return reply.status(200).send({
			status: 'success',
			data: { matched, roomId: roomId ?? null },
			message: matched ? 'Match found' : 'Added to queue'
		});
	} catch (error: unknown) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default enterQueueHandler;
