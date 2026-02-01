import { matchmakingQueueManager } from 'src/managers/MatchmakingQueueManager.js';

const leaveMatchmakingQueue = (userId: string) => {
	matchmakingQueueManager.leave(userId);
};

export default leaveMatchmakingQueue;
