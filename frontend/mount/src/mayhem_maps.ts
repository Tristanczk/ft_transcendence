import { ASPECT_RATIO, BALL_SIZE } from './shared/classic_mayhem';

export type Obstacle = {
    x: number;
    y: number;
    width: number;
    height: number;
    lives: number;
};

export type Obstacles = Obstacle[];

const map1: Obstacles = [
    { x: 0.15, y: 0.15, width: 0.1, height: 0.1, lives: Infinity },
    { x: 0.15, y: 0.85, width: 0.1, height: 0.1, lives: Infinity },
    { x: 0.85, y: 0.15, width: 0.1, height: 0.1, lives: Infinity },
    { x: 0.85, y: 0.85, width: 0.1, height: 0.1, lives: Infinity },
];

const map2: Obstacles = [
    { x: 0.5, y: 0.4, width: 0.030594405594405596, height: 0.05, lives: 1 },
    {
        x: 0.46940559440559443,
        y: 0.35,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.43881118881118886,
        y: 0.30000000000000004,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.40821678321678323,
        y: 0.30000000000000004,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.3776223776223776,
        y: 0.30000000000000004,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.34702797202797203,
        y: 0.35,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.31643356643356646,
        y: 0.4,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.31643356643356646,
        y: 0.45000000000000007,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.31643356643356646,
        y: 0.5,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.34702797202797203,
        y: 0.55,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.3776223776223776,
        y: 0.6,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.40821678321678323,
        y: 0.65,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.43881118881118886,
        y: 0.7000000000000001,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.46940559440559443,
        y: 0.75,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    { x: 0.5, y: 0.8, width: 0.030594405594405596, height: 0.05, lives: 1 },
    {
        x: 0.5305944055944056,
        y: 0.75,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.5611888111888111,
        y: 0.7000000000000001,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.5917832167832168,
        y: 0.65,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.6223776223776223,
        y: 0.6,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.6529720279720279,
        y: 0.55,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.6835664335664335,
        y: 0.5,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.6835664335664335,
        y: 0.45000000000000007,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.6835664335664335,
        y: 0.4,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.6529720279720279,
        y: 0.35,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.6223776223776223,
        y: 0.30000000000000004,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.5917832167832168,
        y: 0.30000000000000004,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.5611888111888111,
        y: 0.30000000000000004,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
    {
        x: 0.5305944055944056,
        y: 0.35,
        width: 0.030594405594405596,
        height: 0.05,
        lives: 1,
    },
];

const map3: Obstacles = [
    {
        x: 0.5,
        y: 0.5,
        width: BALL_SIZE,
        height: BALL_SIZE * ASPECT_RATIO,
        lives: Infinity,
    },
    {
        x: 0.5 - 2 * BALL_SIZE,
        y: 0.5,
        width: BALL_SIZE,
        height: BALL_SIZE * ASPECT_RATIO,
        lives: Infinity,
    },
    {
        x: 0.5 - 26 * BALL_SIZE,
        y: 0.5,
        width: BALL_SIZE,
        height: BALL_SIZE * ASPECT_RATIO,
        lives: Infinity,
    },
    {
        x: 0.5 - 26 * BALL_SIZE,
        y: 0.5 - 2 * BALL_SIZE * ASPECT_RATIO,
        width: BALL_SIZE,
        height: BALL_SIZE * ASPECT_RATIO,
        lives: Infinity,
    },
];

export const maps = [map3];
