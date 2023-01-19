import { WishUserGroup } from '@prisma/client';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const db = new DbContext();

        const group = await readBody<WishUserGroup>(event);

        // todo: verify owner is updater
        // if (user.Id !== auth.id) {
        //     event.res.statusCode = 403;
        //     return '';
        // }

        return await db.updateGroup(group);
    })
);
