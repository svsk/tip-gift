import { Wish, WishUserGroup, WishUserGroupUser } from '.prisma/client';
import { usePrisma } from './usePrisma';

export class DbContext {
    private _db = usePrisma();

    getWishes(userId: string) {
        return this._db.wish.findMany({ where: { UserId: { equals: userId } }, orderBy: [{ Order: 'asc' }] });
    }

    getUsers() {
        return this._db.wishUser.findMany({ orderBy: [{ Name: 'asc' }] });
    }

    getUserByUsername(username: string) {
        return this._db.wishUser.findFirst({ where: { Email: username } });
    }

    saveWish(wish: Wish) {
        return this._db.wish.create({ data: wish });
    }

    saveGroup(group: WishUserGroup) {
        return this._db.wishUserGroup.create({ data: group });
    }

    saveGroupUser(groupUser: WishUserGroupUser) {
        return this._db.wishUserGroupUser.create({ data: groupUser });
    }

    async getUserGroups(userId: string) {
        const memberships = (await this._db.wishUserGroupUser.findMany({ where: { UserId: userId } })).map(
            (g) => g.GroupId
        );

        return this._db.wishUserGroup.findMany({ where: { Id: { in: memberships } } });
    }

    deleteUserGroup(groupId: string) {
        return this._db.wishUserGroup.delete({ where: { Id: groupId } });
    }
}
