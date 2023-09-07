import {
    BALL_HEIGHT,
    BALL_WIDTH,
    LINE_MARGIN,
    LINE_WIDTH,
    PADDLE_MARGIN_X,
    PADDLE_WIDTH,
} from './shared/classic_mayhem';

export const MAYHEM_GRID_HALF_WIDTH = Math.floor(
    (0.5 - BALL_WIDTH / 2 - PADDLE_MARGIN_X - PADDLE_WIDTH) / BALL_WIDTH,
);

export const MAYHEM_GRID_WIDTH = 2 * MAYHEM_GRID_HALF_WIDTH + 1;

export const MAYHEM_GRID_HALF_HEIGHT = Math.floor(
    (0.5 - BALL_HEIGHT / 2 - LINE_MARGIN * 2 - LINE_WIDTH) / BALL_HEIGHT,
);

export const MAYHEM_GRID_HEIGHT = 2 * MAYHEM_GRID_HALF_HEIGHT + 1;

export type MayhemCell = { lives: number; startingLives: number };
export type MayhemMap = MayhemCell[][];

const map1 = [
    '                                                     ',
    '                                                     ',
    '      XXX   XXX                       XXX   XXX      ',
    '     X   X X   X                     X   X X   X     ',
    '    X     X     X                   X     X     X    ',
    '    X           X                   X           X    ',
    '    X           X                   X           X    ',
    '     X         X                     X         X     ',
    '      X       X                       X       X      ',
    '       X     X                         X     X       ',
    '        X   X                           X   X        ',
    '         X X                             X X         ',
    '          X                               X          ',
    '                                                     ',
    '                                                     ',
    '                                                     ',
    '                                                     ',
    '                                                     ',
    '                      XXX   XXX                      ',
    '                     X   X X   X                     ',
    '                    X     X     X                    ',
    '                    X           X                    ',
    '                    X           X                    ',
    '                     X         X                     ',
    '                      X       X                      ',
    '                       X     X                       ',
    '                        X   X                        ',
    '                         X X                         ',
    '                          X                          ',
    '                                                     ',
    '                                                     ',
];

const mapify = (map: string[], idx: number): MayhemMap => {
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

const stringMaps: string[][] = [map1];

export const maps: MayhemMap[] = stringMaps.map((map, idx) => mapify(map, idx));
