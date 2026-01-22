import { FastifyReply, FastifyRequest } from 'fastify';
import { sendError, AppError } from '@core/index.js';
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
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
}

export default finishRoomHandler;
