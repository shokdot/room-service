import { AppError } from "@core/index.js";
import { invitationManager } from "src/managers/InvitationManager.js";
import { roomManager } from "src/managers/RoomManager.js";
import { CHAT_SERVICE_URL, SERVICE_TOKEN } from "src/utils/env.js";
import axios from "axios";

const createInvitation = async (inviterId: string, inviteeId: string) => {
	const existingRoom = roomManager.getRoomByUserId(inviterId);
	if (existingRoom) throw new AppError("INVITER_ALREADY_IN_ROOM");

	const invitation = invitationManager.create(inviterId, inviteeId);

	try {
		await axios.post(
			`${CHAT_SERVICE_URL}/internal/invitation-created`,
			{
				invitationId: invitation.id,
				inviterId: invitation.inviterId,
				inviteeId: invitation.inviteeId
			},
			{
				headers: { "x-service-token": SERVICE_TOKEN }
			}
		);
	} catch (error) {
		// Best-effort: invitation is created but chat delivery failed
		console.error("Failed to send invite via chat-service:", error);
	}

	return invitation;
};

export default createInvitation;
