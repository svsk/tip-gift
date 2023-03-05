import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const { groupId, wishId } = event.context.params;
        return new DbContext().saveWishGroupWish(groupId, wishId);
    })
);
