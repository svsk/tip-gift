import { WishListShare } from '@prisma/client';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

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

            const rngLetters = () =>
                Buffer.from(Math.random().toString()).toString('base64').substring(10, 13).toLowerCase();

            let retries = 0;
            const db = new DbContext();
            let share: WishListShare | null = null;
            while (!share) {
                if (retries > 5) {
                    event.res.statusCode = 500;
                    console.error('Failed to generate unique key for share.');
                    return null;
                }

                try {
                    const random = `${rngLetters()}-${rngLetters()}-${rngLetters()}`;
                    share = await db.createShare(auth.id, random, body.slug, urlSlug);
                } catch (error: any) {
                    console.warn(error);
                }

                retries++;
            }

            return share;
        } catch (error: any) {
            console.error(error);
            event.res.statusCode = 400;
            return null;
        }
    })
);
