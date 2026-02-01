import { AppError } from '@core/index.js';
import { roomManager } from 'src/managers/RoomManager.js';
import { matchmakingQueueManager } from 'src/managers/MatchmakingQueueManager.js';

const enterMatchmakingQueue = async (userId: string) => {
	const inRoom = roomManager.getRoomByUserId(userId);
	if (inRoom) {
		throw new AppError('ALREADY_IN_ROOM');
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
