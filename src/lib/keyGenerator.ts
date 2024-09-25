import { randomBetween } from './random';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';

const getRandomLetters = (from: string, amount: number) =>
    new Array(amount)
        .fill(0)
        .map(() => from[Math.floor(Math.random() * from.length)])
        .join('');

export const createRandomKey = (
    numberOfSegments: number,
    minSegmentSize = 3,
    maxSegmentSize: number | null = null,
    includeNumbers = false
) => {
    const random = new Array(numberOfSegments).fill(0).map(() => {
        const symbolSet = includeNumbers ? alphabet + numbers : alphabet;
        maxSegmentSize = maxSegmentSize || minSegmentSize;
        const segmentSize = randomBetween(minSegmentSize, maxSegmentSize);
        return getRandomLetters(symbolSet, segmentSize);
    });

    return random.join('-');
};
