import axios from "axios";
import { NOTIFICATION_SERVICE_URL, SERVICE_TOKEN } from "src/utils/env.js";

export const broadcastRoomUpdate = async (type: 'ROOM_CREATED' | 'ROOM_DELETED' | 'ROOM_UPDATED', roomId: string, data?: any) => {
    try {
        await axios.post(`${NOTIFICATION_SERVICE_URL}/internal/broadcast`, {
            type,
            message: {
                roomId,
                ...data
            }
        }, {
            headers: {
                'x-service-token': SERVICE_TOKEN
            }
        });
    } catch (error) {
        console.error(`Failed to broadcast room update: ${type} for room ${roomId}`, error);
    }
};
