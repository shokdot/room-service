import { FastifyReply } from 'fastify';
import { AuthRequest } from "@core/types/authRequest.js";
import { getRooms } from "@services/index.js";
import { GetRoomsQueryDTO } from 'src/dto/get-rooms.dto.js';
import { sendError } from "@core/index.js";

const getRoomsHandler = (request: AuthRequest<undefined, GetRoomsQueryDTO>, reply: FastifyReply) => {
    try {
        const { available } = request.query;

        const rooms = getRooms(available === 'true');

        return reply.status(200).send({
            status: 'success',
            data: rooms,
            count: rooms.length
        });

    } catch (error: any) {
        return sendError(reply as any, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error');
    }
}

export default getRoomsHandler;
