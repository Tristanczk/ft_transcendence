import { TAU } from './misc';

export const randomChoice = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

export const randomFloat = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const clamp = (num: number, min: number, max: number): number =>
    num < min ? min : num > max ? max : num;

export const remap = (
    num: number,
    min1: number,
    max1: number,
    min2: number,
    max2: number,
) => ((num - min1) * (max2 - min2)) / (max1 - min1) + min2;

export const trueMod = (x: number, y: number) => {
    let res = x % y;
    return res >= 0 ? res : res + y;
};

export const angleDist = (angle1: number, angle2: number) => {
    angle1 = trueMod(angle1, TAU);
    angle2 = trueMod(angle2, TAU);
    const d1 = angle1 - angle2;
    const d2 = d1 + TAU;
    const d3 = d1 - TAU;
    const ad1 = Math.abs(d1);
    const ad3 = Math.abs(d3);
    return ad1 <= d2 && ad1 <= ad3 ? d1 : d2 <= ad3 ? d2 : d3;
};
