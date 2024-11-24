import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const collaborationId = event.context.params?.collaborationId;
        const groupId = event.context.params?.groupId;

        if (!collaborationId || !groupId) {
            setResponseStatus(event, 400);
            return null;
        }

        const db = new DbContext();
        return await db.getCollaborationMembers(auth.id, groupId, collaborationId);
    })
);
