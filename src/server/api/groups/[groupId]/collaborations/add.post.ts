import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const params = await readBody<{ groupId: string; title: string }>(event);
        if (!params.groupId || !params.title) {
            setResponseStatus(event, 400);
            return null;
        }

        const db = new DbContext();
        return await db.addCollaboration(auth.id, params.groupId, params.title);
    })
);
