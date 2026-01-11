import { AuthRequest } from "@core/types/authRequest.js";
import { FastifyReply } from "fastify";
import sendError from "@core/utils/sendError.js";
import { deleteRoom } from "@services/index.js";

const deleteRoomHandler = (request: AuthRequest<undefined, undefined, { roomId: string }>, reply: FastifyReply) => {
    try {
        const { roomId } = request.params;

        deleteRoom(roomId, request.userId);

        return reply.status(200).send({
            status: 'success',
            message: 'Room deleted successfully'
        });

    } catch (error: any) {
        switch (error.code) {
            case 'ROOM_NOT_FOUND':
                return sendError(reply as any, 404, error.code, 'Room not found');
            case 'UNAUTHORIZED':
                return sendError(reply as any, 401, error.code, 'Unauthorized');
            default:
                return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
        }
    }
};

export default deleteRoomHandler;