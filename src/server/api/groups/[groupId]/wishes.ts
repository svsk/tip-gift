import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler((event) =>
    requireAuth(event, async (auth) => {
        const ctx = new DbContext();
        const groupWishes = ctx.getGroupWishes(event.context.params.groupId);
        return groupWishes;
    })
);
