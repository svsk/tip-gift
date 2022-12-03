import { Wish } from '@prisma/client';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const wish = await readBody<Wish>(event);
        wish.UserId = auth.id;
        return new DbContext().saveWish(wish);
    })
);
