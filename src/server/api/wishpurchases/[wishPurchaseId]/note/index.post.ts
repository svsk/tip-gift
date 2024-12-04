import { WishPurchaseNoteQueries } from '~/data/WishPurchaseNoteQueries';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const { wishPurchaseId } = event.context.params;
        const { note } = await readBody<{ note: string }>(event);

        if (!note) {
            setResponseStatus(event, 400);
            return null;
        }

        return new WishPurchaseNoteQueries().addWishPurchaseNote(auth.id, wishPurchaseId, note);
    })
);
