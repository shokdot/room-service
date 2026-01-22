import { FastifyReply } from 'fastify';
import { joinRoom } from '@services/index.js';
import { RoomByIdDTO } from 'src/dto/room-id.dto.js';
import { sendError, AuthRequest, AppError } from '@core/index.js';

const joinRoomHandler = async (request: AuthRequest<undefined, undefined, RoomByIdDTO>, reply: FastifyReply) => {
	try {
		const { roomId } = request.params;
		const { userId } = request;

		await joinRoom(roomId, userId);

		return reply.status(200).send({
			status: 'success',
			message: 'Successfully joined room'
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
}

export default joinRoomHandler;
