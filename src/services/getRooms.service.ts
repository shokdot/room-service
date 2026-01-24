import { roomManager } from "src/managers/RoomManager.js";

const getRooms = async (available: boolean) => {
	return available ? roomManager.getAvailableRooms() : roomManager.getAllRooms();
}

export default getRooms;
