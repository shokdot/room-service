import { AppError } from "@core/index.js";
import { roomManager } from "src/managers/RoomManager.js";
import { v4 as uuid } from 'uuid';
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

const createRoom = async (userId: string, winScore?: number) => {

	if (winScore && (winScore < 1 || winScore > 30))
		throw new AppError('INVALID_WIN_SCORE');

	// Check if user already has a room
	const existingRoom = roomManager.getRoomByUserId(userId);
	if (existingRoom) {
		throw new AppError('ALREADY_IN_ROOM');
	}

	const roomId = uuid();

	const room = roomManager.createRoom(roomId, userId, winScore);

	try {
		await broadcastRoomUpdate('ROOM_CREATED', roomId, room);
	} catch (error) {
		// Log error but don't fail room creation since room was already created
		console.error('Failed to broadcast room update:', error);
	}

	return room;
}

export default createRoom;
