import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const { wishId } = event.context.params;
        const { except } = await readBody<{ except: string[] }>(event);

        return new DbContext().saveWishInAllGroups(auth.id, wishId, except);
    })
);
