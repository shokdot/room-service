import { FastifyReply } from 'fastify';
import { RoomByIdDTO } from 'src/dto/room-id.dto.js';
import { leaveRoom } from '@services/index.js';
import { sendError, AuthRequest, AppError } from '@core/index.js';

const leaveRoomHandler = async (request: AuthRequest<undefined, undefined, RoomByIdDTO>, reply: FastifyReply) => {
	try {
		const { roomId } = request.params;
		const { userId } = request;

		await leaveRoom(roomId, userId);

		return reply.status(200).send({
			status: 'success',
			message: 'Successfully left room'
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
}

export default leaveRoomHandler;
