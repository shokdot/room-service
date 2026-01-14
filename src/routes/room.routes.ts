import { FastifyInstance } from 'fastify';
import authenticate from '@core/middlewares/authenticate.middleware.js';
import serviceAuth from '@core/middlewares/serviceAuth.middleware.js';
import {
    createRoomHandler,
    getRoomsHandler,
    deleteRoomHandler,
    joinRoomHandler,
    leaveRoomHandler,
    finishRoomHandler,
    serviceLeaveRoomHandler
} from '@controllers/index.js';

const roomRoutes = async (app: FastifyInstance): Promise<void> => {
    app.get('/', { preHandler: authenticate as any }, getRoomsHandler as any); // Schema
    app.post('/', { preHandler: authenticate as any }, createRoomHandler as any); // Schema
    app.delete('/:roomId', { preHandler: authenticate as any }, deleteRoomHandler as any); // Schema
    app.post('/:roomId/join', { preHandler: authenticate as any }, joinRoomHandler as any); // Schema
    app.post('/:roomId/leave', { preHandler: authenticate as any }, leaveRoomHandler as any); // Schema
    app.post('/:roomId/leave-internal', { preHandler: serviceAuth as any }, serviceLeaveRoomHandler as any); // Schema
    app.post('/:roomId/finish', { preHandler: serviceAuth as any }, finishRoomHandler as any); // Schema, stats-service integration
}

export default roomRoutes;