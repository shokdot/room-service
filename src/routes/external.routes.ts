import { FastifyInstance } from 'fastify';
import { authenticate } from '@core/index.js';
import {
	createRoomHandler,
	getRoomsHandler,
	deleteRoomHandler,
	joinRoomHandler,
	leaveRoomHandler
} from '@controllers/external/index.js';

const externalRoutes = async (app: FastifyInstance): Promise<void> => {
	app.get('/', { preHandler: authenticate as any }, getRoomsHandler as any); // Schema
	app.post('/', { preHandler: authenticate as any }, createRoomHandler as any); // Schema
	app.delete('/:roomId', { preHandler: authenticate as any }, deleteRoomHandler as any); // Schema
	app.post('/:roomId/join', { preHandler: authenticate as any }, joinRoomHandler as any); // Schema
	app.post('/:roomId/leave', { preHandler: authenticate as any }, leaveRoomHandler as any); // Schema
}

export default externalRoutes;
