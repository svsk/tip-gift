import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler((event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const { wishId, groupId } = event.context.params;
        new DbContext().giveGroupGift(auth.id, wishId, groupId);
        return 'ok';
    })
);
