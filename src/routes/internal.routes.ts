import { FastifyInstance } from 'fastify';
import serviceAuth from '@core/middlewares/serviceAuth.middleware.js';
import {
    finishRoomHandler,
    leaveRoomHandler
} from '@controllers/internal/index.js';

const publicRoutes = async (app: FastifyInstance): Promise<void> => {
    app.post('/:roomId/leave', { preHandler: serviceAuth as any }, leaveRoomHandler as any); // Schema
    app.post('/:roomId/finish', { preHandler: serviceAuth as any }, finishRoomHandler as any); // Schema, stats-service integration
}

export default publicRoutes;