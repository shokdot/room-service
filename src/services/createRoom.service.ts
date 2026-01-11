import { roomManager } from "src/managers/RoomManager.js";

const createRoom = (userId: string, winScore?: number) => {
    const room = roomManager.createRoom(userId, winScore);
    return room;
}

export default createRoom;