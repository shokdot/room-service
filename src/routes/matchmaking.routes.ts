import { FastifyInstance } from 'fastify';
import { matchmaking } from '@schemas/index.js';
import { enterQueueHandler, leaveQueueHandler } from '@controllers/matchmaking/index.js';

const matchmakingRoutes = async (app: FastifyInstance): Promise<void> => {
	app.post('/queue', matchmaking.enterQueue, enterQueueHandler as any);
	app.delete('/queue', matchmaking.leaveQueue, leaveQueueHandler as any);
};

export default matchmakingRoutes;
