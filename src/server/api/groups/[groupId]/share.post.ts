import { ShareQueries } from '~/data/ShareQueries';
import { defineAuthorizedEventHandler } from '~/lib/defineAuthorizedEventHandler';

export default defineAuthorizedEventHandler(async (event, auth) => {
    try {
        const { slug } = await readBody<{ slug: string }>(event);
        const { groupId } = event.context.params!;

        const queries = new ShareQueries();
        const result = await queries.createGroupShare(auth.id, slug, groupId);
        return result;
    } catch (error: any) {
        console.error(error);
        setResponseStatus(event, 400);
        return null;
    }
});
