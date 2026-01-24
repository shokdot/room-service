import '@fastify/swagger';
import createRoomSchema from "./external/createRoom.schema.js";
import getRoomsSchema from "./external/getRooms.schema.js";
import deleteRoomSchema from "./external/deleteRoom.schema.js";
import joinRoomSchema from "./external/joinRoom.schema.js";
import leaveRoomSchemaExternal from "./external/leaveRoom.schema.js";
import leaveRoomSchemaInternal from "./internal/leaveRoom.schema.js";
import finishRoomSchema from "./internal/finishRoom.schema.js";

export const internal = {
	createRoom: createRoomSchema,
	getRooms: getRoomsSchema,
	deleteRoom: deleteRoomSchema,
	joinRoom: joinRoomSchema,
	leaveRoom: leaveRoomSchemaInternal,
	finishRoom: finishRoomSchema
}

export const external = {
	createRoom: createRoomSchema,
	getRooms: getRoomsSchema,
	deleteRoom: deleteRoomSchema,
	joinRoom: joinRoomSchema,
	leaveRoom: leaveRoomSchemaExternal
}
