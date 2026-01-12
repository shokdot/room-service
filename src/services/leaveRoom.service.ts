import { roomManager } from "src/managers/RoomManager.js";
import { AppError } from "@core/utils/AppError.js";

const leaveRoom = (roomId: string, userId: string) => {
    const room = roomManager.getRoom(roomId);
    if (!room) throw new AppError('ROOM_NOT_FOUND');

    if (!room.players.includes(userId)) {
        throw new AppError('PLAYER_NOT_FOUND_IN_ROOM');
    }

    const roomDeleted = roomManager.removePlayerFromRoom(roomId, userId);

    return roomDeleted;
}

export default leaveRoom;
