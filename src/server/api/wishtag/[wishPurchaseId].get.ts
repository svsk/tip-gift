import { DbContext } from '~~/data/DbContext';

export default defineEventHandler(async (event) => {
    if (!event.context?.params) {
        setResponseStatus(event, 400);
        return null;
    }

    const { wishPurchaseId } = event.context.params;

    const key = wishPurchaseId?.toString();
    if (!key) {
        setResponseStatus(event, 400);
        return null;
    }

    const db = new DbContext();
    const tag = await db.getWishTag(key);

    if (!tag) {
        setResponseStatus(event, 400);
        return null;
    }

    const userId = event.context.auth?.user?.id;

    if (tag.locked && userId !== tag.fromUserId) {
        tag.fromText = null;
        tag.toText = null;
        tag.toUserId = null;
        tag.fromUserId = null;
    } else {
        tag.locked = false;
    }

    return tag;
});
