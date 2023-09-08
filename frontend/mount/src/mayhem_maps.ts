import {
    BALL_HEIGHT,
    BALL_WIDTH,
    LINE_MARGIN,
    LINE_WIDTH,
    PADDLE_MARGIN_X,
    PADDLE_WIDTH,
} from './shared/classic_mayhem';

export const MAYHEM_GRID_HALF_WIDTH =
    Math.floor(
        (0.5 - BALL_WIDTH / 2 - PADDLE_MARGIN_X - PADDLE_WIDTH) / BALL_WIDTH,
    ) - 1;

export const MAYHEM_GRID_HALF_HEIGHT =
    Math.floor(
        (0.5 - BALL_HEIGHT / 2 - LINE_MARGIN * 2 - LINE_WIDTH) / BALL_HEIGHT,
    ) - 1;

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
    '                         X                         ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                         X                         ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                         X                         ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                         X                         ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                         X                         ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                         X                         ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                         X                         ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                         X                         ',
];

const map3 = [
    '9                                                 9',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '    9                   9 9                   9    ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '        9           9         9           9        ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            9   9                 9   9            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '            9   9                 9   9            ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '        9           9         9           9        ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '    9                   9 9                   9    ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '9                                                 9',
];

const map4 = [
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                      1111     1111111111          ',
    '                     1111      111   1111          ',
    '                    1111       11    1111          ',
    '                   1111        1     1111          ',
    '                  1111               1111          ',
    '                 1111                1111          ',
    '                1111                 1111          ',
    '               1111                 1111           ',
    '              1111                 1111            ',
    '             1111                 1111             ',
    '            1111                 1111              ',
    '           1111                 1111               ',
    '          11111                1111                ',
    '          1111111111111111     1111                ',
    '          1111111111111111     1111                ',
    '          1111111111111111     1111     1          ',
    '          1111111111111111     1111    11          ',
    '                      1111     1111   111          ',
    '                      1111     1111111111          ',
    '                      1111                         ',
    '                      1111                         ',
    '                      1111                         ',
    '                      1111                         ',
    '                      1111                         ',
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
    '               XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    ' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX               ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '               XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    ' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX               ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '                                                   ',
    '               XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ',
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
    '                  222222222222222                  ',
    '                         2                         ',
    '                         2                         ',
    '                         2                         ',
    '                         2                         ',
    '                         2                         ',
    '                         2                         ',
    '                         2                         ',
    '                         2                         ',
    '                         2                         ',
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

export const maps: MayhemMap[] = [map0, map1, map2, map3, map4, map5, map6].map(
    (map, idx) => mapify(map, idx),
);
