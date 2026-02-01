import { AppError } from "@core/index.js";
import { invitationManager } from "src/managers/InvitationManager.js";

const declineInvitation = async (invitationId: string, inviteeId: string) => {
	const invitation = invitationManager.get(invitationId);
	if (!invitation) throw new AppError("INVITATION_NOT_FOUND");
	if (invitation.status !== "pending") throw new AppError("INVITATION_NOT_PENDING");
	if (invitation.inviteeId !== inviteeId) throw new AppError("INVITATION_NOT_FOR_USER");

	if (new Date() > invitation.expiresAt) {
		invitation.status = "expired";
		throw new AppError("INVITATION_EXPIRED");
	}

	invitationManager.decline(invitationId);
	return { status: "declined" };
};

export default declineInvitation;
