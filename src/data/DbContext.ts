import { Wish } from '.prisma/client';
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
}
