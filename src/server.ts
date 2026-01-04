import 'dotenv/config'
import { buildApp, startServer, API_PREFIX } from '@core/index.js';
import { PORT, HOST, SERVICE_NAME } from './utils/env.js';
import healthRoutes from '@core/routes/health.routes.js';

const app = buildApp(SERVICE_NAME);
type AppInstance = typeof app;

async function registerRoutes(app: AppInstance) {
	await app.register(healthRoutes, { prefix: `${API_PREFIX}/rooms` });
}

startServer(app, registerRoutes, HOST, PORT);
