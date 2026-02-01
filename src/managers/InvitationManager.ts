import type { GameInvitation } from "../types/invitation.types.js";
import { v4 as uuid } from "uuid";

const DEFAULT_TTL_MINUTES = 5;

class InvitationManager {
	private invitations = new Map<string, GameInvitation>();

	create(inviterId: string, inviteeId: string): GameInvitation {
		const id = uuid();
		const now = new Date();
		const expiresAt = new Date(now.getTime() + DEFAULT_TTL_MINUTES * 60 * 1000);

		const invitation: GameInvitation = {
			id,
			inviterId,
			inviteeId,
			status: "pending",
			createdAt: now,
			expiresAt
		};

		this.invitations.set(id, invitation);
		return invitation;
	}

	get(id: string): GameInvitation | undefined {
		const inv = this.invitations.get(id);
		if (!inv) return undefined;
		if (inv.status !== "pending" && inv.status !== "accepted") return inv;
		if (new Date() > inv.expiresAt) {
			inv.status = "expired";
			return inv;
		}
		return inv;
	}

	getPending(id: string): GameInvitation | undefined {
		const inv = this.get(id);
		if (!inv || inv.status !== "pending") return undefined;
		return inv;
	}

	accept(id: string, roomId: string): GameInvitation | undefined {
		const inv = this.getPending(id);
		if (!inv) return undefined;

		inv.status = "accepted";
		inv.roomId = roomId;
		return inv;
	}

	decline(id: string): GameInvitation | undefined {
		const inv = this.get(id);
		if (!inv || inv.status !== "pending") return undefined;

		inv.status = "declined";
		return inv;
	}
}

export const invitationManager = new InvitationManager();
