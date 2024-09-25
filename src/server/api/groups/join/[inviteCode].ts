import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        if (!event.context?.params) {
            setResponseStatus(event, 400);
            return null;
        }

        const db = new DbContext();

        const { inviteCode } = event.context.params;

        return db.getGroupByInviteCode(inviteCode);
    })
);
