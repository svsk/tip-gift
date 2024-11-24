import {
    type Wish,
    type WishUser,
    type WishUserGroup,
    type WishUserGroupUser,
    type WishPurchase,
} from '@prisma-app/client';
import { usePrisma } from './usePrisma';
import type { WishPurchaseWish, WishTag, WishWithShareRefs } from '~/prisma/customTypes';
import { createRandomKey } from '~/lib/keyGenerator';
import { randomBetween } from '~/lib/random';

export class DbContext {
    private _db = usePrisma();

    async getGivenGifts(groupId: any, userId: string) {
        const myWishes = await this.getWishes(userId);
        const givenGifts = await this._db.wishPurchase.findMany({ where: { GroupId: groupId, WishId: { not: null } } });

        const myWishIds = myWishes.map((w) => w.Id);
        return givenGifts.filter((gg) => !!gg.WishId && !myWishIds.includes(gg.WishId));
    }

    async getWishPurchases(userId: string) {
        const result = await this._db.$queryRaw<WishPurchaseWish[]>`
			SELECT
				wp.*,
				COALESCE(w.[Name], wp.CustomName) AS Name,
				w.UserId,
				w.ImageUrl,
				w.UserId AS WishOwnerId,
				w.Link,
				COALESCE(u.Name, wp.ReceiverName) AS ReceiverName
			FROM [WishPurchase] wp
			LEFT JOIN [Wish] w
				ON w.Id = wp.WishId
			LEFT JOIN [WishUser] u
				 ON u.Id = w.UserId
			WHERE wp.UserId = ${userId}
			AND (w.Id IS NOT NULL OR wp.IsCustom = 1)
		`;

        return result;
    }

    getGroupWishCollaborations(groupId: string, userId: string) {
        this.ensureGroupMembership(userId, groupId);

        return this._db.wishGroupCollaboration.findMany({
            where: { WishUserGroupId: groupId, DeletedDate: { equals: null } },
        });
    }

    getCollaborationMembers(userId: string, groupId: string, collaborationId: string): any {
        this.ensureGroupMembership(userId, groupId);

        return this._db.wishGroupCollaborationMember.findMany({
            where: { WishGroupCollaborationId: collaborationId },
        });
    }

    ensureGroupMembership(userId: string, groupId: string) {
        // Check that user is part of group
        const groupUser = this._db.wishUserGroupUser.findFirst({ where: { UserId: userId, GroupId: groupId } });
        if (!groupUser) {
            throw new Error('User is not part of group');
        }
    }

    async addCollaboration(userId: string, groupId: string, title: string, memberIds: string[]) {
        this.ensureGroupMembership(userId, groupId);

        // Add collaboration and members in single transaction
        return this._db.$transaction(async (tx) => {
            const collaboration = await tx.wishGroupCollaboration.create({
                data: {
                    Title: title,
                    WishUserGroupId: groupId,
                    CreatedByUserId: userId,
                },
            });

            await Promise.all(
                memberIds.map((m) =>
                    tx.wishGroupCollaborationMember.create({
                        data: {
                            WishGroupCollaborationId: collaboration.Id,
                            WishUserGroupId: groupId,
                            UserId: m,
                            CreatedByUserId: userId,
                            IsAdmin: userId === m,
                        },
                    })
                )
            );

            return collaboration;
        });
    }

    async ensureUserIsCollaborationOwner(userId: string, collaborationId: string) {
        const collaboration = await this._db.wishGroupCollaboration.findFirst({
            where: {
                Id: collaborationId,
            },
        });

        if (!collaboration) {
            throw new Error("Couldn't find collaboration");
        }

        if (collaboration.CreatedByUserId !== userId) {
            throw new Error('User is not the owner of the collaboration');
        }
    }

    async deleteCollaboration(userId: string, collaborationId: string) {
        await this.ensureUserIsCollaborationOwner(userId, collaborationId);

        return this._db.wishGroupCollaboration.update({
            data: {
                DeletedDate: new Date(),
                DeletedByUserId: userId,
            },
            where: {
                Id: collaborationId,
            },
        });
    }

    async addCustomWishPurchase(userId: string, customName: string, receiverName: string) {
        await this._db.wishPurchase.create({
            data: { UserId: userId, ReceiverName: receiverName, CustomName: customName, IsCustom: true },
        });
    }

    async updatePurchase(userId: string, purchase: Partial<WishPurchase>) {
        return await this._db.wishPurchase.update({
            data: {
                PurchasedDate: purchase.PurchasedDate,
                ShipmentReceivedDate: purchase.ShipmentReceivedDate,
                WrappedDate: purchase.WrappedDate,
                GivenDate: purchase.GivenDate,
            },
            where: {
                Id: purchase.Id,
                UserId: userId,
            },
        });
    }

    async updateWishTag(userId: string, wishPurchaseId: string, wishTag: WishTag) {
        // Check that wish purchase belongs to user
        const wishPurchase = await this._db.wishPurchase.findFirst({
            where: {
                Id: wishPurchaseId,
                UserId: userId,
            },
        });

        if (!wishPurchase) {
            throw new Error("Couldn't find wish");
        }

        // Check that wish is not already tagged
        const existingTag = await this._db.wishGiftTag.findFirst({ where: { WishPurchaseId: wishPurchaseId } });
        if (existingTag) {
            // Update existing tag
            return this._db.wishGiftTag.update({
                data: {
                    ToText: wishTag.toText || null,
                    FromText: wishTag.fromText || null,
                },
                where: {
                    Id: existingTag.Id,
                },
            });
        }

        return this._db.wishGiftTag.create({
            data: {
                UserId: userId,
                WishPurchaseId: wishPurchaseId,
                ToText: wishTag.toText,
                FromText: wishTag.fromText,
            },
        });
    }

    getWishes(userId: string) {
        return this._db.wish.findMany({
            where: { UserId: { equals: userId }, DeletedDate: { equals: null } },
            orderBy: [{ Order: 'asc' }],
        });
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

    async ensureUserExists(email: string) {
        const user = await this.getUserByUsername(email);
        if (!user) {
            const createdUser = await this.createUser(email);
            return createdUser;
        }

        return user;
    }

    createUser(email: string) {
        return this._db.wishUser.create({ data: { Email: email } });
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
        const groupShareRefs = await this._db.wishGroupWish.findMany({ where: { GroupId: groupId } });
        const wishIds = groupShareRefs.map((wr) => wr.WishId);
        const result = await this._db.wish.findMany({ where: { Id: { in: wishIds }, DeletedDate: { equals: null } } });

        return result.map((wish) => {
            const wishShareRefs = groupShareRefs.filter((wr) => wr.WishId === wish.Id);
            return {
                ...wish,
                Shares: wishShareRefs,
            } as WishWithShareRefs;
        });
    }

    async getGroupUsers(groupId: string) {
        const userRefs = await this._db.wishUserGroupUser.findMany({ where: { GroupId: groupId } });
        return userRefs;
    }

    saveWishGroupWish(groupId: string, wishId: string, collaborationId?: string) {
        return this._db.wishGroupWish.create({
            data: {
                WishId: wishId,
                GroupId: groupId,
                WishGroupCollaborationId: collaborationId,
            },
        });
    }

    async saveWishInAllGroups(userId: string, wishId: string, exceptedGroupIds: string[]) {
        // Validate that the wish belongs to the user
        const wish = await this._db.wish.findFirst({ where: { Id: wishId, UserId: userId } });
        if (!wish) {
            throw new Error("Couldn't find wish");
        }

        // Find all groups the user is a member of (except for those in exceptedGroupIds)
        const groups = await this.getUserGroups(userId);

        // Create a wishGroupWish for each group
        await Promise.all(
            groups.filter((g) => !exceptedGroupIds.includes(g.Id)).map((g) => this.saveWishGroupWish(g.Id, wishId))
        );
    }

    async giveGroupGift(userId: string, wishId: string, groupId: string) {
        await this._db.wishPurchase.create({ data: { UserId: userId, WishId: wishId, GroupId: groupId } });
    }

    async deleteWishPurchase(userId: string, wishPurchaseId: string) {
        const wishPurchase = await this._db.wishPurchase.findFirst({
            where: {
                Id: wishPurchaseId,
            },
        });

        if (!wishPurchase) {
            throw new Error("Couldn't find wish");
        }

        if (wishPurchase.UserId !== userId) {
            throw new Error('User does not own wish.');
        }

        return this._db.wishPurchase.delete({
            where: {
                Id: wishPurchaseId,
            },
        });
    }

    async ungiveGroupGift(userId: string, wishId: string, groupId: string) {
        // todo: make this
    }

    async deleteWishGroupWish(wishGroupWishId: string, groupId: string) {
        const wish = await this._db.wishGroupWish.findFirst({
            where: {
                Id: wishGroupWishId,
                GroupId: groupId,
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

    async deleteWish(wishId: string) {
        return await this._db.wish.update({
            data: {
                DeletedDate: new Date(),
            },
            where: {
                Id: wishId,
            },
        });
    }

    saveGroup(group: WishUserGroup, createdById: string) {
        return this._db.wishUserGroup.create({ data: { ...group, CreatedByUserId: createdById } });
    }

    async updateGroup(group: WishUserGroup) {
        return await this._db.wishUserGroup.update({
            data: {
                GroupName: group.GroupName,
                AvatarColour: group.AvatarColour,
                AvatarEmoji: group.AvatarEmoji,
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

    async getWishTag(wishPurchaseId: string) {
        const result = await this._db.$queryRaw<WishTag[]>`
			SELECT
				COALESCE(wt.ToText, receiver.Name, wp.ReceiverName) AS toText,
				COALESCE(wt.FromText, giver.Name) AS fromText,
				receiver.Id AS toUserId,
				giver.Id AS fromUserId,
				CASE WHEN wp.GivenDate IS NULL THEN 1 ELSE 0 END AS locked
			FROM WishPurchase wp
			LEFT JOIN Wish w ON w.Id = wp.WishId
			LEFT JOIN WishUser receiver ON receiver.Id = w.UserId
			LEFT JOIN WishGiftTag wt ON wt.WishPurchaseId = wp.Id
			JOIN WishUser giver ON giver.Id = wp.UserId
			WHERE wp.Id = ${wishPurchaseId};
		`;

        return result.at(0);
    }

    async generateGroupInviteCode(userId: string, groupId: string) {
        // Ensure that the user is the creator of the group
        const group = await this._db.wishUserGroup.findFirst({ where: { Id: groupId, CreatedByUserId: userId } });

        if (!group) {
            throw new Error("Couldn't find group");
        }

        if (group.InviteCode) {
            return group.InviteCode;
        }

        // Generate a random invite code
        const buildKey = () => createRandomKey(randomBetween(3, 5), 3, 6, true);

        let inviteCode = buildKey();
        let isUnique = false;
        let retries = 0;

        while (!isUnique && retries < 5) {
            // Check that the invite code is unique
            const existing = await this._db.wishUserGroup.findFirst({ where: { InviteCode: inviteCode } });

            if (!existing) {
                isUnique = true;
            } else {
                inviteCode = buildKey();
            }

            retries++;
        }

        if (!isUnique) {
            throw new Error('Failed to generate unique invite code');
        }

        await this._db.wishUserGroup.update({
            data: {
                InviteCode: inviteCode,
            },
            where: {
                Id: groupId,
            },
        });

        return inviteCode;
    }

    getGroupByInviteCode(inviteCode: string) {
        return this._db.wishUserGroup.findFirst({ where: { InviteCode: inviteCode } });
    }
}
