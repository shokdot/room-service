import { FastifyReply } from "fastify";
import { deleteRoom } from "@services/index.js";
import { RoomByIdDTO } from "src/dto/room-id.dto.js";
import { sendError, AuthRequest, AppError } from "@core/index.js";

const deleteRoomHandler = async (request: AuthRequest<undefined, undefined, RoomByIdDTO>, reply: FastifyReply) => {
	try {
		const { roomId } = request.params;

		await deleteRoom(roomId, request.userId);

		return reply.status(200).send({
			status: 'success',
			message: 'Room deleted successfully'
		});

	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
	}
};

export default deleteRoomHandler;
