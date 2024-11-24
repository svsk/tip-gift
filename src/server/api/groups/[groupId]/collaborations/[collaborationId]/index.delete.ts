import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const collaborationId = event.context.params?.collaborationId;

        if (!collaborationId) {
            setResponseStatus(event, 400);
            return null;
        }

        const db = new DbContext();
        await db.deleteCollaboration(auth.id, collaborationId);

        return 'ok';
    })
);
