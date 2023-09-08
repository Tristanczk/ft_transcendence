export const randomChoice = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

export const randomFloat = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

export const clamp = (num: number, min: number, max: number): number =>
    num < min ? min : num > max ? max : num;

export const remap = (
    num: number,
    min1: number,
    max1: number,
    min2: number,
    max2: number,
) => ((num - min1) * (max2 - min2)) / (max1 - min1) + min2;
