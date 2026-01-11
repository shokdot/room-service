import { roomManager } from "src/managers/RoomManager.js";

const getRooms = (available: boolean) => {
    return available ? roomManager.getAvailableRooms() : roomManager.getAllRooms();
}

export default getRooms;