import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { roomManager } from './RoomManager.js';
import { broadcastRoomUpdate } from '../services/broadcastRoomUpdate.service.js';
import { sendNotificationToUser } from '../services/sendNotificationToUser.service.js';
import { GAME_SERVICE_URL, SERVICE_TOKEN } from '../utils/env.js';

const MATCH_FOUND_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

class MatchmakingQueueManager {
	private queue: string[] = [];
	private timeouts = new Map<string, NodeJS.Timeout>();

	public isInQueue(userId: string): boolean {
		return this.queue.includes(userId);
	}

	public async enter(userId: string): Promise<{ matched: boolean; roomId?: string }> {
		this.clearTimeout(userId);
		this.queue.push(userId);

		this.timeouts.set(
			userId,
			setTimeout(() => {
				this.handleTimeout(userId);
			}, MATCH_FOUND_TIMEOUT_MS)
		);

		return this.tryMatch();
	}

	public leave(userId: string): void {
		this.clearTimeout(userId);
		this.queue = this.queue.filter((id) => id !== userId);
	}

	private clearTimeout(userId: string): void {
		const id = this.timeouts.get(userId);
		if (id) {
			clearTimeout(id);
			this.timeouts.delete(userId);
		}
	}

	/** Re-queue users after a failed match and set new timeouts so they can time out. */
	private requeueWithTimeouts(user1: string, user2: string): void {
		this.queue.unshift(user2);
		this.queue.unshift(user1);
		for (const userId of [user1, user2]) {
			this.timeouts.set(
				userId,
				setTimeout(() => this.handleTimeout(userId), MATCH_FOUND_TIMEOUT_MS)
			);
		}
	}

	private handleTimeout(userId: string): void {
		this.timeouts.delete(userId);
		if (!this.queue.includes(userId)) return;
		this.queue = this.queue.filter((id) => id !== userId);
		sendNotificationToUser(userId, 'MATCHMAKING_TIMEOUT', {
			message: 'No match found'
		}).catch(console.error);
	}

	private async tryMatch(): Promise<{ matched: boolean; roomId?: string }> {
		if (this.queue.length < 2) {
			return { matched: false };
		}

		const user1 = this.queue.shift()!;
		const user2 = this.queue.shift()!;
		this.clearTimeout(user1);
		this.clearTimeout(user2);

		const roomId = uuid();
		roomManager.createRoom(roomId, user1, undefined);
		const added = roomManager.addPlayerToRoom(roomId, user2);

		if (!added) {
			roomManager.deleteRoom(roomId);
			this.requeueWithTimeouts(user1, user2);
			return { matched: false };
		}

		const room = roomManager.getRoom(roomId);
		if (!room) {
			this.requeueWithTimeouts(user1, user2);
			return { matched: false };
		}

		try {
			await axios.post(
				`${GAME_SERVICE_URL}/internal/`,
				{
					roomId: room.id,
					userIds: room.players,
					winScore: room.winScore
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'x-service-token': SERVICE_TOKEN
					}
				}
			);
		} catch {
			roomManager.removePlayerFromRoom(roomId, user2);
			roomManager.deleteRoom(roomId);
			this.requeueWithTimeouts(user1, user2);
			throw new Error('GAME_CREATION_FAILED');
		}

		const roomPayload = {
			roomId: room.id,
			id: room.id,
			createdBy: room.createdBy,
			createdAt: room.createdAt,
			status: room.status,
			players: room.players,
			winScore: room.winScore
		};
		await sendNotificationToUser(user1, 'MATCH_FOUND', { roomId: room.id, room: roomPayload }).catch(
			console.error
		);
		await sendNotificationToUser(user2, 'MATCH_FOUND', { roomId: room.id, room: roomPayload }).catch(
			console.error
		);

		await broadcastRoomUpdate('ROOM_CREATED', roomId, room);
		const updatedRoom = roomManager.getRoom(roomId);
		if (updatedRoom) {
			await broadcastRoomUpdate('ROOM_UPDATED', roomId, updatedRoom);
		}

		return { matched: true, roomId };
	}
}

export const matchmakingQueueManager = new MatchmakingQueueManager();
