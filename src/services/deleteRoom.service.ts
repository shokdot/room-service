import { AppError } from '@core/utils/AppError.js';
import { roomManager } from 'src/managers/RoomManager.js'

const deleteRoom = (roomId: string, userId: string) => {

    if (!roomId) {
        throw new AppError('MISSING_ROOM_ID');
    }

    const room = roomManager.getRoom(roomId);
    if (!room) {
        throw new AppError('ROOM_NOT_FOUND');
    }

    if (room.createdBy !== userId) {
        throw new AppError('UNAUTHORIZED');
    }

    roomManager.deleteRoom(roomId);
};

export default deleteRoom;