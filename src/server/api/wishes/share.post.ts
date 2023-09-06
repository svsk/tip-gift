import { WishListShare } from '@prisma/client';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const getRandomLetters = (from: string, amount: number) =>
    new Array(amount)
        .fill(0)
        .map(() => from[Math.floor(Math.random() * from.length)])
        .join('');

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        try {
            const body = await readBody<{ slug: string }>(event);
            const urlSlug = body.slug
                .toLowerCase()
                .replaceAll(' ', '-')
                .replaceAll('ø', 'o')
                .replaceAll('å', 'a')
                .replaceAll('æ', 'ae')
                .replace(/[^a-z-]/gi, '');

            let retries = 0;
            const db = new DbContext();
            let share: WishListShare | null = null;
            while (!share) {
                if (retries > 5) {
                    setResponseStatus(event, 500);
                    console.error('Failed to generate unique key for share.');
                    return null;
                }

                try {
                    const random = [
                        getRandomLetters(alphabet, 3),
                        getRandomLetters(alphabet, 3),
                        getRandomLetters(alphabet, 3),
                    ].join('-');

                    share = await db.createShare(auth.id, random, body.slug, urlSlug);
                } catch (error: any) {
                    console.warn(error);
                }

                retries++;
            }

            return share;
        } catch (error: any) {
            console.error(error);
            setResponseStatus(event, 400);
            return null;
        }
    })
);
