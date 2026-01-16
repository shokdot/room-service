import 'dotenv/config'
import { buildApp, startServer, API_PREFIX } from '@core/index.js';
import { PORT, HOST, SERVICE_NAME } from './utils/env.js';
import healthRoutes from '@core/routes/health.routes.js';
import roomRoutes from 'src/routes/index.js';

const app = buildApp(SERVICE_NAME);
type AppInstance = typeof app;

async function registerRoutes(app: AppInstance) {
	await app.register(healthRoutes, { prefix: `${API_PREFIX}/rooms` });
	await app.register(roomRoutes as any, { prefix: `${API_PREFIX}/rooms` })
}

startServer(app, registerRoutes, HOST, PORT);