import type { WishListShare } from '~/prisma/customTypes';
import { usePrisma } from './usePrisma';
import { createRandomKey } from '~/lib/keyGenerator';

export class ShareQueries {
    private _db = usePrisma();

    async getAllGroupShares(userId: string, groupId: string) {
        await this.ensureGroupMembership(userId, groupId);

        return this._db.wishListShare.findMany({
            where: { GroupId: groupId, UserId: userId },
        });
    }

    async ensureGroupMembership(userId: string, groupId: string) {
        // Check that user is part of group
        const groupUser = await this._db.wishUserGroupUser.findFirst({
            where: { UserId: userId, GroupId: groupId, DeletedDate: { equals: null } },
        });

        if (!groupUser) {
            throw new Error('User is not part of group');
        }

        return groupUser;
    }

    insertShare(userId: string, uniqueKey: string, name: string, slug: string, groupId: string | null) {
        return this._db.wishListShare.create({
            data: {
                UserId: userId,
                UniqueKey: uniqueKey,
                Name: name,
                Slug: slug,
                GroupId: groupId,
            },
        });
    }

    async tryCreateShare(userId: string, desiredSlug: string, groupId: string | null) {
        const urlSlug = desiredSlug
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll('ø', 'o')
            .replaceAll('å', 'a')
            .replaceAll('æ', 'ae')
            .replace(/[^a-z-]/gi, '');

        let retries = 0;

        let share: WishListShare | null = null;

        while (!share) {
            if (retries > 5) {
                console.error('Failed to generate unique key for share.');
                throw new Error('Failed to generate unique key for share.');
            }

            try {
                const random = createRandomKey(3);
                share = await this.insertShare(userId, random, desiredSlug, urlSlug, groupId);
            } catch (error: any) {
                console.warn(error);
            }

            retries++;
        }

        return share;
    }

    async createShare(userId: string, desiredSlug: string) {
        return await this.tryCreateShare(userId, desiredSlug, null);
    }

    async createGroupShare(userId: string, desiredSlug: string, groupId: string) {
        return await this.tryCreateShare(userId, desiredSlug, groupId);
    }
}
