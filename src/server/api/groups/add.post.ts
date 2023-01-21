import { WishUserGroup, WishUserGroupUser } from '@prisma/client';
import { DbContext } from '~~/data/DbContext';
import { requireAuth } from '~~/lib/requireAuth';

export default defineEventHandler(async (event) =>
    requireAuth(event, async (auth) => {
        const db = new DbContext();
        const group = await readBody<WishUserGroup>(event);
        const grp = await db.saveGroup(group, auth.id);

        await db.saveGroupUser({
            GroupId: grp.Id,
            UserId: auth.id,
        } as WishUserGroupUser);

        return grp;
    })
);
