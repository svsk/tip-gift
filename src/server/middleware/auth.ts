export default defineEventHandler(async (event) => {
    try {
        const e = await getUserSession(event);
        if (!e.user || !e.user.email) {
            return;
        }

        const sessionUser = e.user;
        event.context.auth = { user: sessionUser };
    } catch (ex) {
        console.log('It failed', ex);
        // Not logged in
    }
});
