import { FastifyReply } from 'fastify';
import { joinRoom } from '@services/index.js';
import { RoomByIdDTO } from 'src/dto/room-id.dto.js';
import { sendError, AuthRequest } from '@core/index.js';

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
		switch (error.code) {
			case 'ROOM_NOT_FOUND':
				return sendError(reply as any, 404, error.code, 'Room not found');
			case 'ROOM_FULL':
				return sendError(reply as any, 400, error.code, 'Room is already full');
			case 'ALREADY_IN_ROOM':
				return sendError(reply as any, 400, error.code, 'User is already in this room');
			case 'ROOM_NOT_WAITING':
				return sendError(reply as any, 400, error.code, 'Room is not in waiting status');
			case 'GAME_CREATION_FAILED':
				return sendError(reply as any, 500, error.code, 'Failed to create game');
			default:
				return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
		}
	}
}

export default joinRoomHandler;
