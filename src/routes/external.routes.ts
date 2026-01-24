import { FastifyInstance } from 'fastify';
import { external } from '@schemas/index.js';
import {
	createRoomHandler,
	getRoomsHandler,
	deleteRoomHandler,
	joinRoomHandler,
	leaveRoomHandler
} from '@controllers/external/index.js';

const externalRoutes = async (app: FastifyInstance) => {
	app.get('/', external.getRooms, getRoomsHandler as any);
	app.post('/', external.createRoom, createRoomHandler as any);
	app.delete('/:roomId', external.deleteRoom, deleteRoomHandler as any);
	app.post('/:roomId/join', external.joinRoom, joinRoomHandler as any);
	app.post('/:roomId/leave', external.leaveRoom, leaveRoomHandler as any);
}

export default externalRoutes;
