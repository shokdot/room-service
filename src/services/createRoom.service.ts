import { AppError } from "@core/utils/AppError.js";
import { roomManager } from "src/managers/RoomManager.js";
import { v4 as uuid } from 'uuid';

const createRoom = (userId: string, winScore?: number) => {

    if (winScore && (winScore < 1 || winScore > 30))
        throw new AppError('INVALID_WIN_SCORE');

    let roomId = uuid();

    if (roomManager.getRoom(roomId))
        roomId = uuid();

    const room = roomManager.createRoom(roomId, userId, winScore);
    return room;
}

export default createRoom;