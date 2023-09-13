export const getCanvasCtx = (
    ref: React.MutableRefObject<HTMLCanvasElement | null>,
    arenaWidth: number,
    arenaHeight: number,
    willReadFrequently: boolean,
): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const canvas = ref.current;
    if (!canvas) throw new Error('canvas ref is null');
    const ctx = canvas.getContext('2d', { willReadFrequently });
    if (!ctx) throw new Error('canvas 2d context is null');
    canvas.width = arenaWidth;
    canvas.height = arenaHeight;
    canvas.style.width = `${arenaWidth}px`;
    canvas.style.height = `${arenaHeight}px`;
    return [canvas, ctx];
};
