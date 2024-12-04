import { WishPurchaseNoteQueries } from '~/data/WishPurchaseNoteQueries';
import { defineAuthorizedEventHandler } from '~/lib/defineAuthorizedEventHandler';

export default defineAuthorizedEventHandler(async (event, auth) => {
    const wishPurchaseNoteId = event.context.params?.wishPurchaseNoteId;

    if (!wishPurchaseNoteId) {
        setResponseStatus(event, 400);
        return null;
    }

    return await new WishPurchaseNoteQueries().deleteWishPurchaseNoteById(auth.id, wishPurchaseNoteId);
});
