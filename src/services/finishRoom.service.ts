import { roomManager } from "src/managers/RoomManager.js";
import { AppError } from "@core/utils/AppError.js";

const finishRoom = (roomId: string) => {
    const room = roomManager.getRoom(roomId);
    if (!room) throw new AppError('ROOM_NOT_FOUND');

    roomManager.updateRoomStatus(roomId, 'finished');
    return { roomId, status: 'finished' };
}

export default finishRoom;
