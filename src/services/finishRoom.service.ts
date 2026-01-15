import { roomManager } from "src/managers/RoomManager.js";
import { AppError } from "@core/utils/AppError.js";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

const finishRoom = (roomId: string) => {
    const room = roomManager.getRoom(roomId);
    if (!room) throw new AppError('ROOM_NOT_FOUND');

    roomManager.updateRoomStatus(roomId, 'finished');
    roomManager.deleteRoom(roomId);
    broadcastRoomUpdate('ROOM_DELETED', roomId);
    // stats service logic or in Game Service
}

export default finishRoom;
