import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const { groupId, wishId } = event.context.params;
        const { collaborationId } = await readBody<{ collaborationId?: string }>(event);

        return new DbContext().saveWishGroupWish(groupId, wishId, collaborationId);
    })
);
