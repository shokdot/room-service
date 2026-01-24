import { AppError } from "@core/index.js";
import { roomManager } from "src/managers/RoomManager.js";
import { v4 as uuid } from 'uuid';
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

const createRoom = async (userId: string, winScore?: number) => {

	if (winScore && (winScore < 1 || winScore > 30))
		throw new AppError('INVALID_WIN_SCORE');

	const roomId = uuid();

	const room = roomManager.createRoom(roomId, userId, winScore);

	broadcastRoomUpdate('ROOM_CREATED', roomId, room);

	return room;
}

export default createRoom;
