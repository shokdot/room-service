import { FastifyReply, FastifyRequest } from 'fastify';
import { sendError } from '@core/index.js';
import { finishRoom } from '@services/index.js';
import { RoomByIdDTO } from 'src/dto/room-id.dto.js';
import { GameResultDTO } from 'src/dto/game-result.dto.js';

const finishRoomHandler = async (request: FastifyRequest<{ Params: RoomByIdDTO, Body: GameResultDTO }>, reply: FastifyReply) => {
	try {
		const { roomId } = request.params;
		const result = request.body;

		finishRoom(roomId, result);

		return reply.status(200).send({
			status: 'success',
			message: 'Room finished'
		});

	} catch (error: any) {
		switch (error.code) {
			case 'ROOM_NOT_FOUND':
				return sendError(reply as any, 404, error.code, 'Room not found');
			default:
				return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
		}
	}
}

export default finishRoomHandler;
