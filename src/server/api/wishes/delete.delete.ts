import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const db = new DbContext();

        const wishId = getQuery(event).id?.toString();
        if (!wishId) {
            event.res.statusCode = 400;
            return;
        }

        const wishes = await db.getWishes(auth.id);
        if (wishes.some((w) => w.Id === wishId)) {
            await db.deleteWish(wishId);
        } else {
            event.res.statusCode = 403;
        }

        return true;
    })
);
