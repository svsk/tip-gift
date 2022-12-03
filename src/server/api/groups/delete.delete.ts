import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const db = new DbContext();

        const grpId = getQuery(event).id?.toString();
        if (!grpId) {
            event.res.statusCode = 400;
            return;
        }

        const grps = await db.getUserGroups(auth.id);
        if (grps.some((g) => g.Id === grpId)) {
            await db.deleteUserGroup(grpId?.toString());
        } else {
            event.res.statusCode = 403;
        }
    })
);
