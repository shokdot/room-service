import { FastifyReply } from "fastify";
import { acceptInvitation } from "@services/index.js";
import { InvitationIdDTO } from "src/dto/invitation-id.dto.js";
import { sendError, AuthRequest, AppError } from "@core/index.js";

const acceptInvitationHandler = async (
	request: AuthRequest<undefined, undefined, InvitationIdDTO>,
	reply: FastifyReply
) => {
	try {
		const { userId } = request;
		const { invitationId } = request.params;

		const result = await acceptInvitation(invitationId, userId);

		return reply.status(200).send({
			status: "success",
			data: { roomId: result.roomId, gameId: result.gameId },
			message: "Invitation accepted"
		});
	} catch (error: any) {
		if (error instanceof AppError) {
			return sendError(reply, error);
		}
		return sendError(reply, 500, "INTERNAL_SERVER_ERROR", "Internal server error");
	}
};

export default acceptInvitationHandler;
