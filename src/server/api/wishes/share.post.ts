import { ShareQueries } from '~/data/ShareQueries';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        try {
            const body = await readBody<{ slug: string }>(event);
            const desiredSlug = body.slug;

            const queries = new ShareQueries();
            const result = await queries.createShare(auth.id, desiredSlug);
            return result;
        } catch (error: any) {
            console.error(error);
            setResponseStatus(event, 400);
            return null;
        }
    })
);
