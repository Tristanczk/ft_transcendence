import { angleDist } from './functions';

export const BATTLE_MIN_PLAYERS = 2;
export const BATTLE_DEFAULT_PLAYERS = 3;
export const BATTLE_MAX_PLAYERS = 6;
export const BATTLE_MAX_HEIGHT = 720;
export const BATTLE_BALL_SIZE = 0.03;
export const BATTLE_ARC_VERTICES = 20;
export const BATTLE_DOT_SHIFT = 0.8;
export const BATTLE_BETWEEN_PADDLES = 0.0128;
export const BATTLE_PADDLE_MARGIN = 0.05;
export const BATTLE_PADDLE_WIDTH = 0.05;
export const BATTLE_DEFAULT_PADDLE_SIZE = 0.2;
export const BATTLE_HIT_PADDLE =
    1 - BATTLE_PADDLE_MARGIN - BATTLE_PADDLE_WIDTH - BATTLE_BALL_SIZE;
export const BATTLE_HIT_ANGLE_FACTOR = Math.PI * 0.3;
export const BATTLE_HIT_LEEWAY = 0.6;
export const BATTLE_PADDLE_SPEED = 0.005;
export const BATTLE_BALL_SPEED_INCREMENT = 0.00007;
export const BATTLE_DOT_RADIUS = 0.32;

export const BATTLE_COLORS = [
    '#E51654',
    '#16A7E5',
    '#E5D016',
    '#7E16E5',
    '#16E52B',
    '#DDEEFF',
];

export const getBallSpeedStart = (numPlayers: number) =>
    0.0005 + 0.0001 * numPlayers;

export const getBattleLives = (numPlayers: number) =>
    Math.max(2, Math.ceil(10 / numPlayers));

interface AnglyBoi {
    angle: number;
}

const avoidCollision = (
    player1: AnglyBoi,
    player2: AnglyBoi,
    step: number,
): boolean => {
    const angleDiff = angleDist(player1.angle, player2.angle);
    const limit = 2 * BATTLE_DEFAULT_PADDLE_SIZE + BATTLE_BETWEEN_PADDLES;
    if (Math.abs(angleDiff) >= limit) return false;
    const toMove = Math.min((limit - Math.abs(angleDiff)) / 2 + 1e-5, step);
    if (angleDiff > 0) {
        player1.angle += toMove;
        player2.angle -= toMove;
    } else {
        player1.angle -= toMove;
        player2.angle += toMove;
    }
    return true;
};

export const avoidCollisions = (players: (AnglyBoi | null)[]) => {
    const nonNullPlayers = players.filter((p) => p !== null) as AnglyBoi[];
    for (let step = 0.001; step <= 0.1; step += 0.001) {
        for (let i = 0; i < 10; ++i) {
            let collided = false;
            for (let i = 0; i < nonNullPlayers.length; ++i) {
                for (let j = 0; j < nonNullPlayers.length; ++j) {
                    if (
                        i !== j &&
                        avoidCollision(
                            nonNullPlayers[i],
                            nonNullPlayers[j],
                            step,
                        )
                    ) {
                        collided = true;
                    }
                }
            }
            if (!collided) return;
        }
    }
};
