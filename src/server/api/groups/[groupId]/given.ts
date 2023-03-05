import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler((event) =>
    requireAuth(event, async (auth) => {
        const ctx = new DbContext();
        const givenGifts = ctx.getGivenGifts(event.context.params.groupId, auth.id);
        return givenGifts;
    })
);
