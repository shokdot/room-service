export type InvitationStatus = "pending" | "accepted" | "declined" | "expired" | "cancelled";

export interface GameInvitation {
	id: string;
	inviterId: string;
	inviteeId: string;
	status: InvitationStatus;
	roomId?: string;
	createdAt: Date;
	expiresAt: Date;
}
