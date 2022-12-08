import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler((event) =>
    requireAuth(event, (authData) => {
        const db = new DbContext();
        return db.getSharesForUser(authData.id);
    })
);
