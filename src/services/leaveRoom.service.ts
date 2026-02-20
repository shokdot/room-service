import axios from "axios";
import { roomManager } from "src/managers/RoomManager.js";
import { AppError } from "@core/index.js";
import { USER_SERVICE_URL, SERVICE_TOKEN } from "@core/utils/env.js";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

const leaveRoom = async (roomId: string, userId: string) => {
	const room = roomManager.getRoom(roomId);
	if (!room) throw new AppError('ROOM_NOT_FOUND');

	if (!room.players.includes(userId)) {
		throw new AppError('PLAYER_NOT_FOUND_IN_ROOM');
	}

	const isDeleted = roomManager.removePlayerFromRoom(roomId, userId);

	try {
		await axios.patch(
			`${USER_SERVICE_URL}/internal/${userId}/status`,
			{ status: 'ONLINE' },
			{
				headers: {
					'Content-Type': 'application/json',
					'x-service-token': SERVICE_TOKEN
				}
			}
		);
	} catch (error) {
		console.error(`Failed to update status for user ${userId} to ONLINE on leaveRoom:`, error);
	}

	if (isDeleted) {
		broadcastRoomUpdate('ROOM_DELETED', roomId);
	} else {
		broadcastRoomUpdate('ROOM_UPDATED', roomId, roomManager.getRoom(roomId));
	}
}

export default leaveRoom;
