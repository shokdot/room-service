import { AuthRequest } from "@core/types/authRequest.js";
import { FastifyReply } from "fastify";
import { createRoom } from "@services/index.js";
import { CreateRoomDTO } from "src/dto/create-room.dto.js";
import { sendError } from "@core/index.js";

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
        switch (error.code) {
            case 'INVALID_WIN_SCORE':
                return sendError(reply as any, 400, error.code, 'Invalid win score');
            default:
                return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
        }
    }
}

export default createRoomHandler;