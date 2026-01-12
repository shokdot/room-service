import { Room } from "src/types/room.types.js";

class RoomManager {
    private rooms = new Map<string, Room>();

    public createRoom(roomId: string, createdBy: string, winScore?: number): Room {

        const room: Room = {
            id: roomId,
            createdBy,
            createdAt: new Date(),
            status: 'waiting',
            players: [],
            winScore
        };

        this.rooms.set(roomId, room);
        return room;
    }

    public getRoom(roomId: string): Room | undefined {
        return this.rooms.get(roomId);
    }

    public getAllRooms(): Room[] {
        return Array.from(this.rooms.values());
    }

    public addPlayerToRoom(roomId: string, userId: string): boolean {
        const room = this.rooms.get(roomId);
        if (!room) return false;
        if (room.players.length >= 2) return false;
        if (room.players.includes(userId)) return false;
        if (room.status !== 'waiting') return false;

        room.players.push(userId);

        if (room.players.length === 2) {
            this.updateRoomStatus(roomId, 'playing');
        }

        return true;
    }

    public removePlayerFromRoom(roomId: string, userId: string): boolean {
        const room = this.rooms.get(roomId);
        if (!room) return false;

        const index = room.players.indexOf(userId);
        if (index === -1) return false;

        room.players.splice(index, 1);

        if (room.players.length === 0) {
            this.deleteRoom(roomId);
            return true;
        }

        if (room.players.length === 1) {
            this.updateRoomStatus(roomId, 'waiting');
        }

        return false;
    }

    public updateRoomStatus(roomId: string, status: Room['status']): boolean {
        const room = this.rooms.get(roomId);
        if (!room) return false;
        room.status = status;
        return true;
    }

    public deleteRoom(roomId: string): boolean {
        return this.rooms.delete(roomId);
    }

    public getAvailableRooms(): Room[] {
        return Array.from(this.rooms.values())
            .filter(room =>
                room.status === 'waiting' &&
                room.players.length < 2
            );
    }
}

export const roomManager = new RoomManager();