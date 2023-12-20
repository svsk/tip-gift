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

    if (tag.locked) {
        tag.fromName = null;
        tag.toName = null;
        tag.toUserId = null;
        tag.fromUserId = null;
    }

    return tag;
});
