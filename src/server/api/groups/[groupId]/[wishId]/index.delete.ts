import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        // This is kinda lame, but I didn't wanna mess up the route.
        const { wishId: wishGroupWishId, groupId } = event.context.params;
        return new DbContext().deleteWishGroupWish(wishGroupWishId, groupId);
    })
);
