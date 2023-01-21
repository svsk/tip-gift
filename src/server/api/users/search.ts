import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler((event) =>
    requireAuth(event, async (_) => {
        const search = getQuery(event).search?.toString();

        if (!search) {
            return [];
        }

        return new DbContext().searchUsers(search);
    })
);
