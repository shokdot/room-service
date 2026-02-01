import axios from 'axios';
import { NOTIFICATION_SERVICE_URL, SERVICE_TOKEN } from 'src/utils/env.js';

export const sendNotificationToUser = async (
	userId: string,
	type: string,
	message: Record<string, unknown>
): Promise<void> => {
	try {
		await axios.post(
			`${NOTIFICATION_SERVICE_URL}/internal/send`,
			{ userId, type, message },
			{
				headers: {
					'Content-Type': 'application/json',
					'x-service-token': SERVICE_TOKEN
				}
			}
		);
	} catch (error) {
		console.error(`Failed to send notification to user ${userId}:`, error);
	}
};
