import { FastifyReply } from 'fastify';
import { AuthRequest } from '@core/types/authRequest.js';
import { RoomByIdDTO } from 'src/dto/room-id.dto.js';
import { leaveRoom } from '@services/index.js';
import { sendError } from '@core/index.js';

const leaveRoomHandler = async (request: AuthRequest<undefined, undefined, RoomByIdDTO>, reply: FastifyReply) => {
    try {
        const { roomId } = request.params;
        const { userId } = request;

        const roomDeleted = leaveRoom(roomId, userId);

        return reply.status(200).send({
            status: 'success',
            data: { roomDeleted },
            message: 'Successfully left room'
        });

    } catch (error: any) {
        switch (error.code) {
            case 'ROOM_NOT_FOUND':
                return sendError(reply as any, 404, error.code, 'Room not found');
            case 'PLAYER_NOT_FOUND_IN_ROOM':
                return sendError(reply as any, 404, error.code, 'Player not found in room');
            default:
                return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
        }
    }
}

export default leaveRoomHandler;
