import { AppError } from '@core/index.js';
import { roomManager } from 'src/managers/RoomManager.js';
import { matchmakingQueueManager } from 'src/managers/MatchmakingQueueManager.js';
import { broadcastRoomUpdate } from './broadcastRoomUpdate.service.js';

const enterMatchmakingQueue = async (userId: string) => {
	const existingRoom = roomManager.getRoomByUserId(userId);
	if (existingRoom) {
		const wasLastPlayer = roomManager.removePlayerFromRoom(existingRoom.id, userId);
		if (wasLastPlayer) {
			broadcastRoomUpdate('ROOM_DELETED', existingRoom.id).catch(() => { });
		} else {
			broadcastRoomUpdate('ROOM_UPDATED', existingRoom.id, roomManager.getRoom(existingRoom.id)).catch(() => { });
		}
	}

	if (matchmakingQueueManager.isInQueue(userId)) {
		throw new AppError('ALREADY_IN_QUEUE');
	}

	try {
		return await matchmakingQueueManager.enter(userId);
	} catch (err: unknown) {
		if (err instanceof Error && err.message === 'GAME_CREATION_FAILED') {
			throw new AppError('GAME_CREATION_FAILED');
		}
		throw err;
	}
};

export default enterMatchmakingQueue;
