import { WishPurchaseNoteQueries } from '~/data/WishPurchaseNoteQueries';
import { defineAuthorizedEventHandler } from '~/lib/defineAuthorizedEventHandler';

export default defineAuthorizedEventHandler(async (_, auth) => {
	return await new WishPurchaseNoteQueries().getWishPurchaseNotes(auth.id);
});
