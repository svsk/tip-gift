import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const { groupId, userId } = event.context.params;
        return new DbContext().addUserToGroup(groupId, userId);
    })
);
