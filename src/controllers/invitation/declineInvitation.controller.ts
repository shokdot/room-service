import { FastifyReply } from "fastify";
import { declineInvitation } from "@services/index.js";
import { InvitationIdDTO } from "src/dto/invitation-id.dto.js";
import { sendError, AuthRequest, AppError } from "@core/index.js";

const declineInvitationHandler = async (
	request: AuthRequest<undefined, undefined, InvitationIdDTO>,
	reply: FastifyReply
) => {
	try {
		const { userId } = request;
		const { invitationId } = request.params;

		await declineInvitation(invitationId, userId);

		return reply.status(200).send({
			status: "success",
			data: { status: "declined" },
			message: "Invitation declined"
		});
	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, "INTERNAL_SERVER_ERROR", "Internal server error");
	}
};

export default declineInvitationHandler;
