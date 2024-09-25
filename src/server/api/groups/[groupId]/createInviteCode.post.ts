import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler((event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const { groupId } = event.context.params;

        const ctx = new DbContext();
        const inviteCode = ctx.generateGroupInviteCode(auth.id, groupId);
        return inviteCode;
    })
);
