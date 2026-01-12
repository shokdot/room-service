import { FastifyReply, FastifyRequest } from 'fastify';
import { sendError } from '@core/index.js';
import leaveRoom from '@services/leaveRoom.service.js';

const serviceLeaveRoomHandler = async (request: FastifyRequest<{ Params: { roomId: string }, Body: { userId: string } }>, reply: FastifyReply) => {
    try {
        const { roomId } = request.params;
        const { userId } = request.body;

        if (!userId) {
            return sendError(reply as any, 400, 'USER_ID_REQUIRED', 'User ID is required in body');
        }

        leaveRoom(roomId, userId);

        return reply.status(200).send({
            status: 'success',
            message: 'Successfully removed player from room (service call)'
        });
    } catch (error: any) {
        console.error('Service Leave Room Error:', error);
        return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
}

export default serviceLeaveRoomHandler;
