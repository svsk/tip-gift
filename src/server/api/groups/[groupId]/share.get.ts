import { ShareQueries } from '~/data/ShareQueries';
import { defineAuthorizedEventHandler } from '~/lib/defineAuthorizedEventHandler';

export default defineAuthorizedEventHandler(async (event, auth) => {
    const { groupId } = event.context.params!;

    if (!groupId) {
        console.error('Group id not found in params');
        setResponseStatus(event, 400);
        return null;
    }

    const queries = new ShareQueries();
    return queries.getAllGroupShares(auth.id, groupId);
});
