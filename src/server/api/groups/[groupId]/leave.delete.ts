import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler((event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const ctx = new DbContext();
        await ctx.leaveGroup(auth.id, event.context.params.groupId);
        return 'ok';
    })
);
