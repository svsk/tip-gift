import { type WishPurchase } from '@prisma-app/client';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const db = new DbContext();

        const purchase = await readBody<Partial<WishPurchase>>(event);

        return await db.updatePurchase(auth.id, purchase);
    })
);
