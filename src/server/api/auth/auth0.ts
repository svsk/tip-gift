import { DbContext } from '~/data/DbContext';

export default defineOAuthAuth0EventHandler({
    config: {
        emailRequired: true,
    },
    async onSuccess(event, { user }) {
        const db = new DbContext();
        const ensuredUser = await db.ensureUserExists(user.email);
        await setUserSession(event, { user: { ...user, id: ensuredUser.Id } });
        return sendRedirect(event, '/');
    },
});
