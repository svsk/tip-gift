import { DbContext } from '~~/data/DbContext';

export default defineEventHandler(async (event) => {
    const key = event.context.params.uniqueKey;
    const db = new DbContext();
    const share = await db.getShareByKey(key);

    if (!share) {
        event.res.statusCode = 400;
        return null;
    }

    const wishes = await db.getWishes(share.UserId);
    return {
        wishes,
        share,
    };
});
