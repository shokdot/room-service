import { AppError } from "@core/index.js";
import { roomManager } from "src/managers/RoomManager.js";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

/** Generate a short, human-friendly room code (6 uppercase alphanumeric chars).
 *  Uses only unambiguous characters (no 0/O, 1/I/L) for easy verbal sharing. */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function generateRoomCode(): string {
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
	}
	return code;
}

const createRoom = async (userId: string, winScore?: number) => {

	if (winScore && (winScore < 1 || winScore > 30))
		throw new AppError('INVALID_WIN_SCORE');

	// Check if user already has a room
	const existingRoom = roomManager.getRoomByUserId(userId);
	if (existingRoom) {
		throw new AppError('ALREADY_IN_ROOM');
	}

	// Generate a unique short code (retry on collision)
	let roomId: string;
	let attempts = 0;
	do {
		roomId = generateRoomCode();
		attempts++;
	} while (roomManager.getRoom(roomId) && attempts < 10);

	if (roomManager.getRoom(roomId)) {
		throw new AppError('ROOM_CODE_COLLISION');
	}

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
