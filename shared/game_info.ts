import { EMPTY_MAP, MayhemMap } from './mayhem_maps';

export type GameState = 'waiting' | 'playing' | 'finished';

export type ClassicMayhemGameObjects = {
    ballPosX: number;
    ballPosY: number;
    ballVelX: number;
    ballVelY: number;
    mayhemMap: MayhemMap;
    hasNet: boolean;
};

export const DEFAULT_CLASSIC_OBJECTS: ClassicMayhemGameObjects = {
    ballPosX: 0.5,
    ballPosY: 0.5,
    ballVelX: 0,
    ballVelY: 0,
    mayhemMap: EMPTY_MAP,
    hasNet: true,
};

export const DEFAULT_MAYHEM_OBJECTS: ClassicMayhemGameObjects = {
    ballPosX: 0.5,
    ballPosY: 0.5,
    ballVelX: 0,
    ballVelY: 0,
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
