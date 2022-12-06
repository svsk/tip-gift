import { Wish } from '@prisma/client';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const wishes = await readBody<Wish[]>(event);
        return new DbContext().updateWishes(auth.id, wishes);
    })
);
