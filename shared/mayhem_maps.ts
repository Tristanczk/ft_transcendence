import {
    BALL_HEIGHT,
    BALL_WIDTH,
    LINE_MARGIN,
    LINE_WIDTH,
    PADDLE_MARGIN_X,
    PADDLE_WIDTH,
} from './classic_mayhem';
import { randomChoice } from './functions';
import { MultiBall } from './game_info';

const MAYHEM_GRID_HALF_WIDTH =
    Math.floor(
        (0.5 - BALL_WIDTH / 2 - PADDLE_MARGIN_X - PADDLE_WIDTH) / BALL_WIDTH,
    ) - 1;

const MAYHEM_GRID_HALF_HEIGHT =
    Math.floor(
        (0.5 - BALL_HEIGHT / 2 - LINE_MARGIN * 2 - LINE_WIDTH) / BALL_HEIGHT,
    ) - 1;

export const getMayhemCellPos = (x: number, y: number) => ({
    posX: 0.5 + BALL_WIDTH * (x - MAYHEM_GRID_HALF_WIDTH),
    posY: 0.5 + BALL_HEIGHT * (y - MAYHEM_GRID_HALF_HEIGHT),
});

export type MayhemCell = { lives: number; startingLives: number };
export type MayhemMap = MayhemCell[][];

const map0 = [
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
];

const map1 = [
    '                                                   ',
    '     333   333                       333   333     ',
    '    3   3 3   3                     3   3 3   3    ',
    '   3     3     3                   3     3     3   ',
    '   3           3                   3           3   ',
    '   3           3                   3           3   ',
    '    3         3                     3         3    ',
    '     3       3                       3       3     ',
    '      3     3                         3     3      ',
    '       3   3                           3   3       ',
    '        3 3                             3 3        ',
    '         3                               3         ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                     333   333                     ',
    '                    3   3 3   3                    ',
    '                   3     3     3                   ',
    '                   3           3                   ',
    '                   3           3                   ',
    '                    3         3                    ',
    '                     3       3                     ',
    '                      3     3                      ',
    '                       3   3                       ',
    '                        3 3                        ',
    '                         3                         ',
    '                                                   ',
];

const map2 = [
    '            X                         X            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            X                         X            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            X                         X            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            X                         X            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            X                         X            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            X                         X            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            X                         X            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            X                         X            ',
];

const map3 = [
    '7                                                 7',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '    7                   7 7                   7    ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '        7           7         7           7        ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            7   7                 7   7            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            7   7                 7   7            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '        7           7         7           7        ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '    7                   7 7                   7    ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '7                                                 7',
];

const map4 = [
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                   1111     1111111111             ',
    '                  1111      111   1111             ',
    '                 1111       11    1111             ',
    '                1111        1     1111             ',
    '               1111               1111             ',
    '              1111                1111             ',
    '             1111                 1111             ',
    '            1111                 1111              ',
    '           1111                 1111               ',
    '          1111                 1111                ',
    '         1111                 1111                 ',
    '        1111                 1111                  ',
    '       11111                1111                   ',
    '       1111111111111111     1111                   ',
    '       1111111111111111     1111                   ',
    '       1111111111111111     1111     1             ',
    '       1111111111111111     1111    11             ',
    '                   1111     1111   111             ',
    '                   1111     1111111111             ',
    '                   1111                            ',
    '                   1111                            ',
    '                   1111                            ',
    '                   1111                            ',
    '                   1111                            ',
    '                                                   ',
    '                                                   ',
];

const map5 = [
    '                                                   ',
    '                                                   ',
    ' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX               ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '               XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    ' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX               ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '               XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    ' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX               ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '               XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ',
    '                                                   ',
    '                                                   ',
];

const map6 = [
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                  2             2                  ',
    '                2222222222222222222                ',
    '                2     2     2     2                ',
    '                2     2     2     2                ',
    '                2     2     2     2                ',
    '                2     2     2     2                ',
    '                2     2     2     2                ',
    '                2     2     2     2                ',
    '                2     2     2     2                ',
    '                2     2     2     2                ',
    '                                                   ',
];

const map7 = [
    '           6                           6           ',
    '                                                   ',
    '               1    7         7    1               ',
    '                                                   ',
    '     5   8    4                     4    8   5     ',
    '               2                   2               ',
    ' 74     93        6             6        39     47 ',
    '         17                             71         ',
    '     5 8       3                   3       8 5     ',
    '   9                                           9   ',
    '         8  5 2                     2 5  8         ',
    '                 1       4       1                 ',
    ' 8         4                           4         8 ',
    '                  6             6                  ',
    '                                                   ',
    '  74 486   4                           4   684 47  ',
    '             1                       1             ',
    '   5  2                  1                  2  5   ',
    '         8  8         7     7         8  8         ',
    '          3                             3          ',
    '  9                                             9  ',
    '2    3      9                         9      3    2',
    '                  4             4                  ',
    '                    34 8   8 43                    ',
    '  3           1   4             4   1           3  ',
    ' 22                                             22 ',
    '     8 6                                   6 8     ',
    '   3   1                                   1   3   ',
    '8       34                               43       8',
];

const mapify = (map: string[], idx: number): MayhemMap => {
    const MAYHEM_GRID_WIDTH = 2 * MAYHEM_GRID_HALF_WIDTH + 1;
    const MAYHEM_GRID_HEIGHT = 2 * MAYHEM_GRID_HALF_HEIGHT + 1;
    if (map.length !== MAYHEM_GRID_HEIGHT) {
        throw new Error(
            `Map ${idx} has wrong height: ${map.length} instead of ${MAYHEM_GRID_HEIGHT}`,
        );
    }
    const result: MayhemMap = [];
    for (let y = 0; y < map.length; ++y) {
        const row = map[y];
        if (row.length !== MAYHEM_GRID_WIDTH) {
            throw new Error(
                `Map ${idx} row ${y} has wrong width: ${row.length} instead of ${MAYHEM_GRID_WIDTH}`,
            );
        }
        const resultRow: MayhemCell[] = [];
        for (let x = 0; x < row.length; ++x) {
            const cell = row[x];
            if (cell === ' ') {
                resultRow.push({ lives: 0, startingLives: 0 });
            } else if (cell === 'X') {
                resultRow.push({ lives: Infinity, startingLives: Infinity });
            } else if (cell >= '0' && cell <= '9') {
                const lives = parseInt(cell);
                resultRow.push({ lives, startingLives: lives });
            } else {
                throw new Error(
                    `Map ${idx} row ${y} column ${x} has invalid cell value: ${cell}`,
                );
            }
        }
        result.push(resultRow);
    }
    return result;
};

export const maps: MayhemMap[] = [
    map0,
    map1,
    map2,
    map3,
    map4,
    map5,
    map6,
    map7,
].map(mapify);

export const EMPTY_MAP = mapify(map0, 0);

export type MayhemMapCollision = {
    surface: number;
    gridX: number;
    gridY: number;
    newPosX: number;
    newPosY: number;
    newVelX: number;
    newVelY: number;
};

export const randomMap = (): MayhemMap =>
    JSON.parse(JSON.stringify(randomChoice(maps)));

const hitMayhemCell = (
    ball: MultiBall,
    gridX: number,
    gridY: number,
): MayhemMapCollision | null => {
    const { posX, posY } = getMayhemCellPos(gridX, gridY);
    const left = posX - BALL_WIDTH;
    const right = posX + BALL_WIDTH;
    const top = posY - BALL_HEIGHT;
    const bottom = posY + BALL_HEIGHT;
    if (
        ball.posX <= left ||
        ball.posX >= right ||
        ball.posY <= top ||
        ball.posY >= bottom
    )
        return null;
    const distances = [
        ball.velY <= 0
            ? Infinity
            : Math.abs(ball.posY - top) / Math.abs(ball.velY),
        ball.velX >= 0
            ? Infinity
            : Math.abs(ball.posX - right) / Math.abs(ball.velX),
        ball.velY >= 0
            ? Infinity
            : Math.abs(ball.posY - bottom) / Math.abs(ball.velY),
        ball.velX <= 0
            ? Infinity
            : Math.abs(ball.posX - left) / Math.abs(ball.velX),
    ];
    const collisionSide = distances.indexOf(Math.min(...distances));
    let newPosX = ball.posX;
    let newPosY = ball.posY;
    let newVelX = ball.velX;
    let newVelY = ball.velY;
    if (collisionSide === 0) {
        newVelY = -ball.velY;
        newPosY = top;
    } else if (collisionSide === 1) {
        newVelX = -ball.velX;
        newPosX = right;
    } else if (collisionSide === 2) {
        newVelY = -ball.velY;
        newPosY = bottom;
    } else {
        newVelX = -ball.velX;
        newPosX = left;
    }
    const surface =
        collisionSide & 1
            ? Math.min(distances[0], distances[2]) / BALL_HEIGHT
            : Math.min(distances[1], distances[3]) / BALL_WIDTH;
    return { surface, gridX, gridY, newPosX, newPosY, newVelX, newVelY };
};

export const hitMayhemMap = (ball: MultiBall, mayhemMap: MayhemMap) => {
    let bestCollision: MayhemMapCollision | null = null;
    for (let y = 0; y < mayhemMap.length; ++y) {
        const row = mayhemMap[y];
        for (let x = 0; x < row.length; ++x) {
            const mayhemCell = row[x];
            if (mayhemCell.lives > 0) {
                const collision = hitMayhemCell(ball, x, y);
                if (
                    collision &&
                    (!bestCollision ||
                        collision.surface > bestCollision.surface)
                ) {
                    bestCollision = collision;
                }
            }
        }
    }
    if (bestCollision) {
        ball.posX = bestCollision.newPosX;
        ball.posY = bestCollision.newPosY;
        ball.velX = bestCollision.newVelX;
        ball.velY = bestCollision.newVelY;
        --mayhemMap[bestCollision.gridY][bestCollision.gridX].lives;
    }
};
