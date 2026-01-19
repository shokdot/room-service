import { roomManager } from "src/managers/RoomManager.js";
import { AppError } from "@core/utils/AppError.js";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

import { GameResultDTO } from "src/dto/game-result.dto.js";

const finishRoom = (roomId: string, result?: GameResultDTO) => {
    const room = roomManager.getRoom(roomId);
    if (!room) throw new AppError('ROOM_NOT_FOUND');

    roomManager.updateRoomStatus(roomId, 'finished');
    roomManager.deleteRoom(roomId);
    broadcastRoomUpdate('ROOM_DELETED', roomId);

    // stats service logic
    console.log(`[RoomService] Game finished for room ${roomId}. Results:`, result);
}

export default finishRoom;
