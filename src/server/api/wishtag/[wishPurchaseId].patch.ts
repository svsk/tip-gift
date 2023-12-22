import type { WishTag } from '~/prisma/customTypes';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const wishTag = await readBody<WishTag>(event);
        const { wishPurchaseId } = event.context.params;

        return new DbContext().updateWishTag(auth.id, wishPurchaseId, wishTag);
    })
);
