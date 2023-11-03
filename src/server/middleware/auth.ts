import { serverSupabaseClient } from '#supabase/server';
import { DbContext } from '~~/data/DbContext';

export default defineEventHandler(async (event) => {
    try {
        const e = await serverSupabaseClient(event);
        const user = await e.auth.getUser();
        event.context.auth = user;

        const ctx = new DbContext();
        ctx.ensureUserExists(user.data.user?.id, user.data.user?.email);
    } catch {
        // Not logged in
    }
});
