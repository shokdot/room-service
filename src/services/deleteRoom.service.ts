import { AppError } from '@core/index.js';
import { roomManager } from 'src/managers/RoomManager.js'
import { broadcastRoomUpdate } from './broadcastRoomUpdate.service.js';

const deleteRoom = async (roomId: string, userId: string) => {

	if (!roomId) {
		throw new AppError('MISSING_ROOM_ID');
	}

	const room = roomManager.getRoom(roomId);
	if (!room) {
		throw new AppError('ROOM_NOT_FOUND');
	}

	if (room.createdBy !== userId) {
		throw new AppError('UNAUTHORIZED');
	}

	roomManager.deleteRoom(roomId);
	broadcastRoomUpdate('ROOM_DELETED', roomId);
};

export default deleteRoom;
