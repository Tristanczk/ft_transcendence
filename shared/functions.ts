export const randomChoice = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

export const randomFloat = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

export const clamp = (num: number, min: number, max: number): number =>
    num < min ? min : num > max ? max : num;
