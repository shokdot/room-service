import { roomManager } from "src/managers/RoomManager.js";
import { AppError } from "@core/utils/AppError.js";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

const leaveRoom = (roomId: string, userId: string) => {
    const room = roomManager.getRoom(roomId);
    if (!room) throw new AppError('ROOM_NOT_FOUND');

    if (!room.players.includes(userId)) {
        throw new AppError('PLAYER_NOT_FOUND_IN_ROOM');
    }

    const isDeleted = roomManager.removePlayerFromRoom(roomId, userId);

    if (isDeleted) {
        broadcastRoomUpdate('ROOM_DELETED', roomId);
    } else {
        broadcastRoomUpdate('ROOM_UPDATED', roomId, roomManager.getRoom(roomId));
    }
}

export default leaveRoom;
