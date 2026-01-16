import { FastifyInstance } from 'fastify';
import publicRoutes from './public.routes.js';
import internalRoutes from './internal.routes.js'

const roomRoutes = async (app: FastifyInstance): Promise<void> => {
    app.register(publicRoutes);
    app.register(internalRoutes, { prefix: '/internal' });
}

export default roomRoutes;