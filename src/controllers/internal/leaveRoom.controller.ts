import { FastifyReply, FastifyRequest } from 'fastify';
import { leaveRoom } from '@services/index.js';
import { RoomByIdDTO } from 'src/dto/room-id.dto.js';
import { UserIdDTO } from 'src/dto/user-id.dto.js';
import { sendError, AppError } from '@core/index.js';

const leaveRoomHandler = async (request: FastifyRequest<{ Params: RoomByIdDTO, Body: UserIdDTO }>, reply: FastifyReply) => {
	try {
		const { roomId } = request.params;
		const { userId } = request.body;

		await leaveRoom(roomId, userId);

		return reply.status(200).send({
			status: 'success',
			message: 'Successfully removed player from room'
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
}

export default leaveRoomHandler;
