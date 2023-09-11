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

export type MayhemGameObjects = ClassicGameObjects; // TODO
export const DEFAULT_MAYHEM_OBJECTS: MayhemGameObjects =
    DEFAULT_CLASSIC_OBJECTS; // TODO

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
