import { type WishListShare } from '@prisma-app/client';
import { ShareQueries } from '~/data/ShareQueries';
import { createRandomKey } from '~/lib/keyGenerator';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        try {
            const body = await readBody<{ slug: string }>(event);
            const desiredSlug = body.slug;

            const queries = new ShareQueries();
            const result = await queries.createShare(auth.id, desiredSlug);
            return result;
        } catch (error: any) {
            console.error(error);
            setResponseStatus(event, 400);
            return null;
        }
    })
);
