const getScoreString = (scoreLeft: number, scoreRight: number): string => {
    const scoreLength = Math.max(
        scoreLeft.toString().length,
        scoreRight.toString().length,
    );
    return `${scoreLeft.toString().padStart(scoreLength, ' ')} - ${scoreRight
        .toString()
        .padEnd(scoreLength, ' ')}`;
};

export default getScoreString;
