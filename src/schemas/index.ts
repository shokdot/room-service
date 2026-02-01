import '@fastify/swagger';
import createRoomSchema from "./external/createRoom.schema.js";
import getRoomsSchema from "./external/getRooms.schema.js";
import deleteRoomSchema from "./external/deleteRoom.schema.js";
import joinRoomSchema from "./external/joinRoom.schema.js";
import leaveRoomSchemaExternal from "./external/leaveRoom.schema.js";
import leaveRoomSchemaInternal from "./internal/leaveRoom.schema.js";
import finishRoomSchema from "./internal/finishRoom.schema.js";
import createInvitationSchema from "./invitation/createInvitation.schema.js";
import acceptInvitationSchema from "./invitation/acceptInvitation.schema.js";
import declineInvitationSchema from "./invitation/declineInvitation.schema.js";
import enterQueueSchema from "./matchmaking/enterQueue.schema.js";
import leaveQueueSchema from "./matchmaking/leaveQueue.schema.js";

export const internal = {
	createRoom: createRoomSchema,
	getRooms: getRoomsSchema,
	deleteRoom: deleteRoomSchema,
	joinRoom: joinRoomSchema,
	leaveRoom: leaveRoomSchemaInternal,
	finishRoom: finishRoomSchema
};

export const external = {
	createRoom: createRoomSchema,
	getRooms: getRoomsSchema,
	deleteRoom: deleteRoomSchema,
	joinRoom: joinRoomSchema,
	leaveRoom: leaveRoomSchemaExternal,
};


export const invitation = {
	createInvitation: createInvitationSchema,
	acceptInvitation: acceptInvitationSchema,
	declineInvitation: declineInvitationSchema
};

export const matchmaking = {
	enterQueue: enterQueueSchema,
	leaveQueue: leaveQueueSchema
};
