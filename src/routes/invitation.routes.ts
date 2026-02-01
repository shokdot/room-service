import { FastifyInstance } from "fastify";
import { invitation } from "@schemas/index.js";
import {
	createInvitationHandler,
	acceptInvitationHandler,
	declineInvitationHandler
} from "@controllers/invitation/index.js";

const invitationRoutes = async (app: FastifyInstance): Promise<void> => {
	app.post("/", invitation.createInvitation, createInvitationHandler as any);
	app.post("/:invitationId/accept", invitation.acceptInvitation, acceptInvitationHandler as any);
	app.post("/:invitationId/decline", invitation.declineInvitation, declineInvitationHandler as any);
};

export default invitationRoutes;
