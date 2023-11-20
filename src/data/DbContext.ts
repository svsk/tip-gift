import { type Wish, type WishUser, type WishUserGroup, type WishUserGroupUser } from '@prisma-app/client';
import { usePrisma } from './usePrisma';

export class DbContext {
    async getGivenGifts(groupId: any, userId: string) {
        const myWishes = await this.getWishes(userId);
        const givenGifts = await this._db.wishPurchase.findMany({ where: { GroupId: groupId } });

        const myWishIds = myWishes.map((w) => w.Id);
        return givenGifts.filter((gg) => !myWishIds.includes(gg.WishId));
    }

    private _db = usePrisma();

    getWishes(userId: string) {
        return this._db.wish.findMany({ where: { UserId: { equals: userId } }, orderBy: [{ Order: 'asc' }] });
    }

    getSharesForUser(userId: string) {
        return this._db.wishListShare.findMany({ where: { UserId: userId } });
    }

    getShareByKey(key: string) {
        return this._db.wishListShare.findFirst({ where: { UniqueKey: key } });
    }

    getUsers() {
        return this._db.wishUser.findMany({ orderBy: [{ Name: 'asc' }] });
    }

    searchUsers(search: string) {
        return this._db.wishUser.findMany({ where: { Name: { contains: search } } });
    }

    async updateUser(user: WishUser) {
        return await this._db.wishUser.update({
            data: {
                Name: user.Name,
                AvatarEmoji: user.AvatarEmoji,
                AvatarColour: user.AvatarColour,
                PreferredLanguage: user.PreferredLanguage,
            },
            where: {
                Id: user.Id,
            },
        });
    }

    async getUserById(id: string) {
        return (await this._db.wishUser.findFirst({ where: { Id: id } })) || null;
    }

    async ensureUserExists(id: string | undefined, email: string | undefined) {
        if (id && email) {
            const user = await this.getUserById(id);
            if (!user) {
                await this.createUser(id, email);
            }
        }
    }

    createUser(id: string, email: string) {
        return this._db.wishUser.create({ data: { Id: id, Email: email } });
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

    async getGroupWishes(groupId: string) {
        const wishRefs = await this._db.wishGroupWish.findMany({ where: { GroupId: groupId } });
        const wishIds = wishRefs.map((wr) => wr.WishId);
        return this._db.wish.findMany({ where: { Id: { in: wishIds } } });
    }

    async getGroupUsers(groupId: string) {
        const userRefs = await this._db.wishUserGroupUser.findMany({ where: { GroupId: groupId } });
        return userRefs;
    }

    saveWishGroupWish(groupId: string, wishId: string) {
        return this._db.wishGroupWish.create({
            data: {
                WishId: wishId,
                GroupId: groupId,
            },
        });
    }

    async giveGroupGift(userId: string, wishId: string, groupId: string) {
        await this._db.wishPurchase.create({ data: { UserId: userId, WishId: wishId, GroupId: groupId } });
    }

    async ungiveGroupGift(userId: string, wishId: string, groupId: string) {
        // todo: make this
    }

    async deleteWishGroupWish(wishId: string, groupId: string) {
        const wish = await this._db.wishGroupWish.findFirst({
            where: {
                GroupId: groupId,
                WishId: wishId,
            },
        });

        if (!wish) {
            throw new Error("Couldn't find wish");
        }

        return this._db.wishGroupWish.delete({
            where: {
                Id: wish.Id,
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

    saveGroup(group: WishUserGroup, createdById: string) {
        return this._db.wishUserGroup.create({ data: { ...group, CreatedByUserId: createdById } });
    }

    async updateGroup(group: WishUserGroup) {
        return await this._db.wishUserGroup.update({
            data: {
                GroupName: group.GroupName,
            },
            where: {
                Id: group.Id,
            },
        });
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

    async addUserToGroup(groupId: string, userId: string) {
        const existing = await this._db.wishUserGroupUser.findFirst({ where: { UserId: userId, GroupId: groupId } });
        if (existing) {
            return existing;
        }

        return this._db.wishUserGroupUser.create({ data: { GroupId: groupId, UserId: userId } });
    }

    deleteUserGroup(groupId: string) {
        return this._db.wishUserGroup.delete({ where: { Id: groupId } });
    }
}
