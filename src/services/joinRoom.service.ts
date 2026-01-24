import { AppError } from "@core/index.js";
import { roomManager } from "src/managers/RoomManager.js";
import { GAME_SERVICE_URL, SERVICE_TOKEN } from 'src/utils/env.js';
import axios from "axios";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

const joinRoom = async (roomId: string, userId: string) => {

	const initialRoom = roomManager.getRoom(roomId);
	if (!initialRoom) throw new AppError('ROOM_NOT_FOUND');

	const added = roomManager.addPlayerToRoom(roomId, userId);

	if (!added) {
		const currentRoom = roomManager.getRoom(roomId);
		if (!currentRoom) throw new AppError('ROOM_NOT_FOUND');
		if (currentRoom.players.length >= 2) throw new AppError('ROOM_FULL');
		if (currentRoom.players.includes(userId)) throw new AppError('ALREADY_IN_ROOM');
		if (currentRoom.status !== 'waiting') throw new AppError('ROOM_NOT_WAITING');
		throw new AppError('JOIN_ROOM_FAILED');
	}

	const room = roomManager.getRoom(roomId);
	if (!room) throw new AppError('ROOM_NOT_FOUND');

	if (room.players.length === 2) {
		try {
			await axios.post(`${GAME_SERVICE_URL}/internal/`, {
				roomId: room.id,
				userIds: room.players,
				winScore: room.winScore
			}, {
				headers: {
					'x-service-token': SERVICE_TOKEN
				}
			});
			const updatedRoom = roomManager.getRoom(roomId);
			if (updatedRoom) {
				broadcastRoomUpdate('ROOM_UPDATED', roomId, updatedRoom);
			}
		} catch (error: any) {
			roomManager.removePlayerFromRoom(roomId, userId);
			const updatedRoom = roomManager.getRoom(roomId);
			if (updatedRoom) {
				broadcastRoomUpdate('ROOM_UPDATED', roomId, updatedRoom);
			}
			throw new AppError('GAME_CREATION_FAILED');
		}
	} else {
		const updatedRoom = roomManager.getRoom(roomId);
		if (updatedRoom) {
			broadcastRoomUpdate('ROOM_UPDATED', roomId, updatedRoom);
		}
	}

}

export default joinRoom;
