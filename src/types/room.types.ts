export interface Room {
	id: string;
	createdBy: string;
	createdAt: Date;
	status: 'waiting' | 'playing' | 'finished';
	players: string[];
	winScore?: number;
}
