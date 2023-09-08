export const randomChoice = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

export const randomFloat = (min: number, max: number): number =>
    Math.random() * (max - min) + min;
