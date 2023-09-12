import { EMPTY_MAP, MayhemMap } from './mayhem_maps';

export type GameState = 'waiting' | 'playing' | 'finished';

export type MultiBall = {
    posX: number;
    posY: number;
    velX: number;
    velY: number;
};

const DEFAULT_MULTIBALL: MultiBall = {
    posX: 0.5,
    posY: 0.5,
    velX: 0,
    velY: 0,
};

export type ClassicMayhemGameObjects = {
    balls: MultiBall[];
    mayhemMap: MayhemMap;
    hasNet: boolean;
};

export const DEFAULT_CLASSIC_OBJECTS: ClassicMayhemGameObjects = {
    balls: [{ ...DEFAULT_MULTIBALL }],
    mayhemMap: EMPTY_MAP,
    hasNet: true,
};

export const DEFAULT_MAYHEM_OBJECTS: ClassicMayhemGameObjects = {
    balls: [
        { ...DEFAULT_MULTIBALL },
        { ...DEFAULT_MULTIBALL },
        { ...DEFAULT_MULTIBALL },
    ],
    mayhemMap: EMPTY_MAP,
    hasNet: false,
};

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
    timeRemaining: number;
} & (
    | {
          mode: 'classic';
          objects: ClassicMayhemGameObjects;
      }
    | {
          mode: 'mayhem';
          objects: ClassicMayhemGameObjects;
      }
    | {
          mode: 'battle';
          objects: BattleGameObjects;
      }
);
