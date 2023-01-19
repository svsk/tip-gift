import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler((event) =>
    requireAuth(event, async (auth) => {
        const { userId } = event.context.params;
        return new DbContext().getUserById(userId);
    })
);
