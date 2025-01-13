import { type WishGroupCollaboration, type WishUserGroup } from '@prisma-app/client';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const db = new DbContext();

        const collab = await readBody<WishGroupCollaboration>(event);

        return await db.updateCollaboration(auth.id, collab);
    })
);
