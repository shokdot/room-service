import { FastifyInstance } from 'fastify';
import authenticate from '@core/middlewares/authenticate.middleware.js';
import {
    createRoomHandler,
    getRoomsHandler,
    deleteRoomHandler
} from '@controllers/index.js';

const roomRoutes = async (app: FastifyInstance): Promise<void> => {
    app.get('/', { preHandler: authenticate as any }, getRoomsHandler as any);
    app.post('/', { preHandler: authenticate as any }, createRoomHandler as any);
    app.delete('/:roomId', { preHandler: authenticate as any }, deleteRoomHandler as any);
}

export default roomRoutes;

// Join a specific room (requires auth)
// app.post('/:roomId/join', { preHandler: serviceAuth }, joinRoomHandler);

// Optional additional routes:
// app.get('/:roomId', getRoomByIdHandler);              // Get single room details
// app.delete('/:roomId', deleteRoomHandler);            // Delete room
// app.post('/:roomId/leave', leaveRoomHandler);         // Leave room
// app.get('/user/my-rooms', getUserRoomsHandler);       // Get user's rooms