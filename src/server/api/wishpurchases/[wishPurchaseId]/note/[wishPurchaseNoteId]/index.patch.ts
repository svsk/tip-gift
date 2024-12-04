import { WishPurchaseNoteQueries } from '~/data/WishPurchaseNoteQueries';
import { defineAuthorizedEventHandler } from '~/lib/defineAuthorizedEventHandler';

export default defineAuthorizedEventHandler(async (event, auth) => {
    if (!event.context?.params) {
        setResponseStatus(event, 400);
        return null;
    }

    const { wishPurchaseNoteId } = event.context.params;
    const { note } = await readBody<{ note: string }>(event);

    if (!note) {
        setResponseStatus(event, 400);
        return null;
    }

    return new WishPurchaseNoteQueries().updateWishPurchaseNote(auth.id, wishPurchaseNoteId, note);
});
