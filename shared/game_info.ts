import { EMPTY_MAP, MayhemMap } from './mayhem_maps';

export type GameState = 'waiting' | 'playing' | 'finished';

export type MultiBall = {
    posX: number;
    posY: number;
    velX: number;
    velY: number;
};

const DEFAULT_CLASSIC_MAYHEM_BALL: MultiBall = {
    posX: 0.5,
    posY: 0.5,
    velX: 0,
    velY: 0,
};

const DEFAULT_BATTLE_BALL: MultiBall = {
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
};

export type ClassicMayhemGameObjects = {
    balls: MultiBall[];
    mayhemMap: MayhemMap;
    hasNet: boolean;
};

export type Paddle = {
    keys: { clockwise: number; antiClockwise: number };
    color: string;
    paddleSize: number;
    angle: number;
    lives: number;
};

export type BattleGameObjects = {
    ball: MultiBall;
};

export const getDefaultClassicObjects = (): ClassicMayhemGameObjects => ({
    balls: [{ ...DEFAULT_CLASSIC_MAYHEM_BALL }],
    mayhemMap: EMPTY_MAP,
    hasNet: true,
});

export const getDefaultMayhemObjects = (): ClassicMayhemGameObjects => ({
    balls: [
        { ...DEFAULT_CLASSIC_MAYHEM_BALL },
        { ...DEFAULT_CLASSIC_MAYHEM_BALL },
        { ...DEFAULT_CLASSIC_MAYHEM_BALL },
    ],
    mayhemMap: EMPTY_MAP,
    hasNet: false,
});

export const getDefaultBattleObjects = (): BattleGameObjects => ({
    ball: { ...DEFAULT_BATTLE_BALL },
});

export type ClassicMayhemPlayer = {
    id: string;
    pos: number;
    score: number;
    activeKeys: Set<string>;
};

export type ClassicMayhemPlayers = (ClassicMayhemPlayer | null)[];

export type BattlePlayer = {
    id: string;
    pos: number;
    score: number;
    activeKeys: Set<string>;
};

export type BattlePlayers = (BattlePlayer | null)[];

export type GameInfo = {
    state: GameState;
    timeRemaining: number;
} & (
    | {
          mode: 'classic' | 'mayhem';
          players: ClassicMayhemPlayers;
          objects: ClassicMayhemGameObjects;
      }
    | {
          mode: 'battle';
          players: BattlePlayers;
          objects: BattleGameObjects;
      }
);
