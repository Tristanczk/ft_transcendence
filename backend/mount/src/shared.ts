const gameModes = ['classic', 'mayhem', 'battle'] as const;
export type GameMode = (typeof gameModes)[number];
export const isGameMode = (value: any): value is GameMode =>
    gameModes.includes(value);

export const MAX_PLAYERS: Record<GameMode, number> = {
    classic: 2,
    mayhem: 2,
    battle: 6,
};

export type GameState = 'waiting' | 'playing' | 'finished';

export type ClassicGameObjects = {
    ballPosX: number;
    ballPosY: number;
    ballVelX: number;
    ballVelY: number;
};

export const DEFAULT_CLASSIC_OBJECTS: ClassicGameObjects = {
    ballPosX: 0.5,
    ballPosY: 0.5,
    ballVelX: 0,
    ballVelY: 0,
};

export type MayhemGameObjects = {};
export const DEFAULT_MAYHEM_OBJECTS: MayhemGameObjects = {};
export type BattleGameObjects = {};
export const DEFAULT_BATTLE_OBJECTS: BattleGameObjects = {};

export type Player = {
    id: string;
    pos: number;
    score: number;
    activeKeys: Set<string>;
};

export type Players = (Player | null)[];

export type GameInfo = {
    state: GameState;
    players: Players;
} & (
    | {
          mode: 'classic';
          objects: ClassicGameObjects;
      }
    | {
          mode: 'mayhem';
          objects: MayhemGameObjects;
      }
    | {
          mode: 'battle';
          objects: BattleGameObjects;
      }
);

export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export type KeyEventType = 'down' | 'up';
export type KeyEvent = { key: string; type: KeyEventType; gameId: string };

// classic_mayhem.ts

export const WINNING_SCORE = 7;
export const ASPECT_RATIO = 286 / 175;
export const BALL_SIZE = 0.018;
export const LINE_MARGIN = 0.01;
export const PADDLE_MARGIN_X = LINE_MARGIN / ASPECT_RATIO;
export const PADDLE_WIDTH = 0.015;
export const PADDLE_HEIGHT = 0.16;
export const PADDLE_SPEED = 0.001;
export const LINE_WIDTH = PADDLE_WIDTH;
export const BALL_SPEED_START = 0.0005;
export const BALL_SPEED_INCREMENT = 0.00005;
export const MAX_Y_FACTOR = 2.0;
export const BALL_LOW = BALL_SIZE / 2 + 2 * LINE_MARGIN + LINE_WIDTH;
export const BALL_HIGH = 1 - BALL_LOW;
export const PADDLE_LOW = PADDLE_HEIGHT / 2 + 2 * LINE_MARGIN + LINE_WIDTH;
export const PADDLE_HIGH = 1 - PADDLE_LOW;
export const BALL_RADIUS = BALL_SIZE / 2;
export const COLLISION_X = PADDLE_MARGIN_X + PADDLE_WIDTH + BALL_RADIUS;
export const COLLISION_Y = PADDLE_HEIGHT / 2 + BALL_RADIUS;
