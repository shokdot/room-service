export interface GameResultDTO {
    winner: number;
    finalScore: {
        player1: number;
        player2: number;
    };
    gameDuration: number;
    startTime: string | Date;
    endTime: string | Date;
    players: Array<{
        userId: string;
        playerNumber: number;
    }>;
}
