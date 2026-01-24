import { FastifyInstance } from 'fastify';
import { internal } from '@schemas/index.js';
import { finishRoomHandler, leaveRoomHandler } from '@controllers/internal/index.js';

const internalRoutes = async (app: FastifyInstance) => {
	app.post('/:roomId/leave', internal.leaveRoom, leaveRoomHandler as any);
	app.post('/:roomId/finish', internal.finishRoom, finishRoomHandler as any); // stats-service integration
}

export default internalRoutes;
