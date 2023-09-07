const gameModes = ['classic', 'mayhem', 'battle'] as const;
export type GameMode = (typeof gameModes)[number];
export const isGameMode = (value: any): value is GameMode =>
    gameModes.includes(value);

export const MAX_PLAYERS: Record<GameMode, number> = {
    classic: 2,
    mayhem: 2,
    battle: 6,
};

export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export type KeyEventType = 'down' | 'up';
export type KeyEvent = { key: string; type: KeyEventType; gameId: string };
