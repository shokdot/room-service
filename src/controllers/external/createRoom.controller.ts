import { FastifyReply } from "fastify";
import { createRoom } from "@services/index.js";
import { CreateRoomDTO } from "src/dto/create-room.dto.js";
import { sendError, AuthRequest, AppError } from "@core/index.js";

const createRoomHandler = async (request: AuthRequest<CreateRoomDTO>, reply: FastifyReply) => {
	try {
		const { userId } = request;
		const { winScore } = request.body ?? {};

		const room = createRoom(userId, winScore);

		return reply.status(201).send({
			status: 'success',
			data: room,
			message: 'Room created successfully'
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
}

export default createRoomHandler;
