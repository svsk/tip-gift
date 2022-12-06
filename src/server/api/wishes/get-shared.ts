import { DbContext } from '~~/data/DbContext';

export default defineEventHandler(async (event) => {
    const { uniqueKey } = getQuery(event);
    const key = uniqueKey?.toString();
    if (!key) {
        event.res.statusCode = 400;
        return null;
    }

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
