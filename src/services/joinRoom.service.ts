import { AppError } from "@core/utils/AppError.js";
import { roomManager } from "src/managers/RoomManager.js";
import { GAME_SERVICE_URL, SERVICE_TOKEN } from 'src/utils/env.js';
import axios from "axios";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";

const joinRoom = async (roomId: string, userId: string) => {

    const room = roomManager.getRoom(roomId);
    if (!room) throw new AppError('ROOM_NOT_FOUND');

    const added = roomManager.addPlayerToRoom(roomId, userId);

    if (!added) {
        if (room.players.length >= 2) throw new AppError('ROOM_FULL');
        if (room.players.includes(userId)) throw new AppError('ALREADY_IN_ROOM');
        if (room.status !== 'waiting') throw new AppError('ROOM_NOT_WAITING');
        throw new AppError('JOIN_ROOM_FAILED');
    }

    if (room.players.length === 2) {
        try {
            await axios.post(`${GAME_SERVICE_URL}/internal/`, {
                roomId: room.id,
                winScore: room.winScore
            }, {
                headers: {
                    'x-service-token': SERVICE_TOKEN
                }
            });
            broadcastRoomUpdate('ROOM_UPDATED', roomId, room);
        } catch (error: any) {
            roomManager.removePlayerFromRoom(roomId, userId);
            broadcastRoomUpdate('ROOM_UPDATED', roomId, room);
            throw new AppError('GAME_CREATION_FAILED');
        }
    } else {
        broadcastRoomUpdate('ROOM_UPDATED', roomId, room);
    }

}

export default joinRoom;
