import type { WishListShare } from '~/prisma/customTypes';
import { usePrisma } from './usePrisma';
import { createRandomKey } from '~/lib/keyGenerator';

export class ShareQueries {
    private _db = usePrisma();

    insertShare(userId: string, uniqueKey: string, name: string, slug: string) {
        return this._db.wishListShare.create({
            data: {
                UserId: userId,
                UniqueKey: uniqueKey,
                Name: name,
                Slug: slug,
            },
        });
    }

    async createShare(userId: string, desiredSlug: string) {
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
                share = await this.insertShare(userId, random, desiredSlug, urlSlug);
            } catch (error: any) {
                console.warn(error);
            }

            retries++;
        }

        return share;
    }
}
