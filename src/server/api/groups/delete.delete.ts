import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const db = new DbContext();

        const grpId = getQuery(event).id?.toString();
        if (!grpId) {
            setResponseStatus(event, 400);
            return;
        }

        const grps = await db.getUserGroups(auth.id);
        if (grps.some((g) => g.Id === grpId)) {
            await db.deleteUserGroup(grpId?.toString());
        } else {
            setResponseStatus(event, 403);
        }

        return true;
    })
);
