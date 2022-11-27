import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
    try {
        const e = serverSupabaseClient(event);
        const user = await e.auth.getUser();
        event.context.auth = user;
    } catch {
        // Not logged in
    }
});
