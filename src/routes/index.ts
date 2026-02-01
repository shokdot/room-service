import { FastifyInstance } from 'fastify';
import externalRoutes from './external.routes.js';
import internalRoutes from './internal.routes.js'
import invitationRoutes from './invitation.routes.js';

const roomRoutes = async (app: FastifyInstance): Promise<void> => {
	app.register(externalRoutes);
	app.register(invitationRoutes, { prefix: '/invitations' });
	app.register(internalRoutes, { prefix: '/internal' });
}

export default roomRoutes;
