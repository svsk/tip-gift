import { Wish, WishUserGroup, WishUserGroupUser } from '.prisma/client';
import { usePrisma } from './usePrisma';

export class DbContext {
    private _db = usePrisma();

    getWishes(userId: string) {
        return this._db.wish.findMany({ where: { UserId: { equals: userId } }, orderBy: [{ Order: 'asc' }] });
    }

    getShareByKey(key: string) {
        return this._db.wishListShare.findFirst({ where: { UniqueKey: key } });
    }

    getUsers() {
        return this._db.wishUser.findMany({ orderBy: [{ Name: 'asc' }] });
    }

    getUserByUsername(username: string) {
        return this._db.wishUser.findFirst({ where: { Email: username } });
    }

    createShare(userId: string, uniqueKey: string, name: string, slug: string) {
        return this._db.wishListShare.create({
            data: {
                UserId: userId,
                UniqueKey: uniqueKey,
                Name: name,
                Slug: slug,
            },
        });
    }

    saveWish(wish: Wish) {
        return this._db.wish.create({ data: wish });
    }

    async updateWishes(userId: string, wishes: Wish[]) {
        return await this._db.$transaction(async (tx) => {
            const updatesWishes = new Array<Wish>();

            for (var i = 0; i < wishes.length; i++) {
                const w = wishes[i];

                const updated = await tx.wish.update({
                    data: {
                        Name: w.Name,
                        Description: w.Description,
                        Price: w.Price,
                        Order: w.Order,
                        Link: w.Link,
                        ImageUrl: w.ImageUrl,
                    },
                    where: {
                        Id: w.Id,
                    },
                });

                if (updated.UserId !== userId) {
                    throw new Error('User does not own wish.');
                }

                updatesWishes.push(updated);
            }

            return updatesWishes;
        });
    }

    deleteWish(wishId: string) {
        return this._db.wish.delete({ where: { Id: wishId } });
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
