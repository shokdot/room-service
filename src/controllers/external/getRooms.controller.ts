import { FastifyReply } from 'fastify';
import { getRooms } from "@services/index.js";
import { GetRoomsQueryDTO } from 'src/dto/get-rooms.dto.js';
import { sendError, AuthRequest, AppError } from "@core/index.js";

const getRoomsHandler = async (request: AuthRequest<undefined, GetRoomsQueryDTO>, reply: FastifyReply) => {
	try {
		const { available } = request.query;

		const rooms = await getRooms(available === 'true');

		return reply.status(200).send({
			status: 'success',
			data: rooms,
			count: rooms.length
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
}

export default getRoomsHandler;
