import { roomManager } from "src/managers/RoomManager.js";
import { AppError } from "@core/utils/AppError.js";

const finishRoom = (roomId: string) => {
    const room = roomManager.getRoom(roomId);
    if (!room) throw new AppError('ROOM_NOT_FOUND');

    roomManager.updateRoomStatus(roomId, 'finished');
    roomManager.deleteRoom(roomId);
    // stats service logic or in Game Service
    return { isRoomDeleted: true }
}

export default finishRoom;
