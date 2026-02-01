import { AppError } from "@core/index.js";
import { invitationManager } from "src/managers/InvitationManager.js";
import { roomManager } from "src/managers/RoomManager.js";
import { GAME_SERVICE_URL, SERVICE_TOKEN } from "src/utils/env.js";
import { broadcastRoomUpdate } from "./broadcastRoomUpdate.service.js";
import axios from "axios";
import { v4 as uuid } from "uuid";

const acceptInvitation = async (invitationId: string, inviteeId: string) => {
	const invitation = invitationManager.getPending(invitationId);
	if (!invitation) {
		const inv = invitationManager.get(invitationId);
		if (!inv) throw new AppError("INVITATION_NOT_FOUND");
		if (inv.status === "expired" || new Date() > inv.expiresAt)
			throw new AppError("INVITATION_EXPIRED");
		throw new AppError("INVITATION_NOT_PENDING");
	}
	if (invitation.inviteeId !== inviteeId) throw new AppError("INVITATION_NOT_FOR_USER");

	const inviterInRoom = roomManager.getRoomByUserId(invitation.inviterId);
	if (inviterInRoom) throw new AppError("INVITER_ALREADY_IN_ROOM");

	const inviteeInRoom = roomManager.getRoomByUserId(inviteeId);
	if (inviteeInRoom) throw new AppError("INVITEE_ALREADY_IN_ROOM");

	const roomId = uuid();
	roomManager.createRoom(roomId, invitation.inviterId, undefined);
	const added = roomManager.addPlayerToRoom(roomId, inviteeId);
	if (!added) {
		roomManager.deleteRoom(roomId);
		throw new AppError("JOIN_ROOM_FAILED");
	}

	const room = roomManager.getRoom(roomId);
	if (!room) {
		throw new AppError("ROOM_NOT_FOUND");
	}

	try {
		await axios.post(
			`${GAME_SERVICE_URL}/internal/`,
			{
				roomId: room.id,
				userIds: room.players,
				winScore: room.winScore
			},
			{ headers: { "x-service-token": SERVICE_TOKEN } }
		);
	} catch (error) {
		roomManager.removePlayerFromRoom(roomId, inviteeId);
		roomManager.deleteRoom(roomId);
		throw new AppError("GAME_CREATION_FAILED");
	}

	invitationManager.accept(invitationId, roomId);

	const updatedRoom = roomManager.getRoom(roomId);
	if (updatedRoom) {
		broadcastRoomUpdate("ROOM_UPDATED", roomId, updatedRoom);
	}

	return { roomId, gameId: roomId };
};

export default acceptInvitation;
