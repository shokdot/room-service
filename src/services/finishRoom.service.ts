import { roomManager } from "src/managers/RoomManager.js";
import { AppError, API_PREFIX } from "@core/index.js";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";
import { GameResultDTO } from "src/dto/game-result.dto.js";
import { STATS_SERVICE_URL, SERVICE_TOKEN } from 'src/utils/env.js';
import axios from "axios";

const finishRoom = async (roomId: string, result?: GameResultDTO) => {
	const room = roomManager.getRoom(roomId);
	if (!room) throw new AppError('ROOM_NOT_FOUND');

	// If we have complete game results, record the match in stats-service
	const hasCompleteResult = result?.winner != null && result?.finalScore != null && result?.gameDuration != null;
	if (hasCompleteResult && room.players.length === 2) {
		try {
			// Map GameResultDTO to stats-service format
			const playerA = result!.players.find(p => p.playerNumber === 0);
			const playerB = result!.players.find(p => p.playerNumber === 1);

			if (!playerA || !playerB) {
				throw new AppError('VALIDATION_FAILED', 400, 'Invalid player data');
			}

			// Determine winner ID (winner is 0 for player1, 1 for player2)
			const winnerId = result!.winner === 0
				? playerA.userId
				: result!.winner === 1
					? playerB.userId
					: null;

			// Map scores (player1 is playerA, player2 is playerB)
			const scoreA = result!.finalScore.player1;
			const scoreB = result!.finalScore.player2;

			// Convert duration from milliseconds to seconds
			const duration = Math.floor(result!.gameDuration / 1000);

			// Construct URL robustly: handle if STATS_SERVICE_URL already includes path or not
			const baseUrl = STATS_SERVICE_URL.replace(/\/$/, ''); // Remove trailing slash
			const statsPath = `${API_PREFIX}/stats`;
			// If baseUrl doesn't end with /stats (or /stats/api/v1/stats etc), append the prefix
			const url = baseUrl.includes('/stats')
				? `${baseUrl}/internal/matches`
				: `${baseUrl}${statsPath}/internal/matches`;

			console.log(`[RoomService] Recording match to ${url}`, {
				roomId,
				winnerId,
				scoreA,
				scoreB,
				duration
			});

			await axios.post(url, {
				playerAId: playerA.userId,
				playerBId: playerB.userId,
				scoreA,
				scoreB,
				winnerId,
				duration
			}, {
				headers: {
					'x-service-token': SERVICE_TOKEN
				}
			});
			console.log(`[RoomService] Match recorded successfully`);
		} catch (error: any) {
			// Log detailed error
			console.error(`[RoomService] Failed to record match in stats-service:`, error.message);
			if (error.response) {
				console.error(`[RoomService] Stats service response:`, error.response.status, error.response.data);
			}
		}
	}

	roomManager.updateRoomStatus(roomId, 'finished');
	roomManager.deleteRoom(roomId);
	broadcastRoomUpdate('ROOM_DELETED', roomId);
}

export default finishRoom;
