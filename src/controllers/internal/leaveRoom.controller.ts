import { FastifyReply, FastifyRequest } from 'fastify';
import { leaveRoom } from '@services/index.js';
import { RoomByIdDTO } from 'src/dto/room-id.dto.js';
import { UserIdDTO } from 'src/dto/user-id.dto.js';
import { sendError } from '@core/index.js';

const leaveRoomHandler = async (request: FastifyRequest<{ Params: RoomByIdDTO, Body: UserIdDTO }>, reply: FastifyReply) => {
	try {
		const { roomId } = request.params;
		const { userId } = request.body;

		leaveRoom(roomId, userId);

		return reply.status(200).send({
			status: 'success',
			message: 'Successfully removed player from room'
		});

	} catch (error: any) {
		switch (error.code) {
			case 'ROOM_NOT_FOUND':
				return sendError(reply as any, 404, error.code, 'Room not found');
			case 'USER_NOT_IN_ROOM':
				return sendError(reply as any, 400, error.code, 'User is not in this room');
			default:
				return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
		}
	}
}

export default leaveRoomHandler;
