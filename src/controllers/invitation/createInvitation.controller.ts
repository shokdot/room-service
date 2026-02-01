import { FastifyReply } from "fastify";
import { createInvitation } from "@services/index.js";
import { CreateInvitationDTO } from "src/dto/create-invitation.dto.js";
import { sendError, AuthRequest, AppError } from "@core/index.js";

const createInvitationHandler = async (request: AuthRequest<CreateInvitationDTO>, reply: FastifyReply) => {
	try {
		const { userId } = request;
		const { inviteeId } = request.body;

		const invitation = await createInvitation(userId, inviteeId);

		return reply.status(201).send({
			status: "success",
			data: {
				id: invitation.id,
				inviterId: invitation.inviterId,
				inviteeId: invitation.inviteeId,
				status: invitation.status,
				createdAt: invitation.createdAt.toISOString(),
				expiresAt: invitation.expiresAt.toISOString()
			},
			message: "Invitation created successfully"
		});
	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, "INTERNAL_SERVER_ERROR", "Internal server error");
	}
};

export default createInvitationHandler;
