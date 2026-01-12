import { FastifyReply, FastifyRequest } from 'fastify';
import { sendError } from '@core/index.js';
import finishRoom from '@services/finishRoom.service.js';

const finishRoomHandler = async (request: FastifyRequest<{ Params: { roomId: string } }>, reply: FastifyReply) => {
    try {
        const { roomId } = request.params;
        finishRoom(roomId);

        return reply.status(200).send({
            status: 'success',
            message: 'Room finished'
        });
    } catch (error: any) {
        console.error('Finish Room Error:', error);
        return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
}

export default finishRoomHandler;
