import p5Types from 'p5';

export const drawRepeatingBackground = (
    p5: p5Types,
    bgImage: p5Types.Image,
) => {
    p5.imageMode(p5.CORNER);
    for (let y = 0; y < p5.height; y += bgImage.height) {
        for (let x = 0; x < p5.width; x += bgImage.width) {
            p5.image(bgImage, x, y);
        }
    }
};
