import { usePrisma } from './usePrisma';

export class DbContext {
    private _db = usePrisma();

    getWishes() {
        return this._db.wish.findMany({ orderBy: [{ Order: 'asc' }] });
    }

    getUsers() {
        return this._db.wishUser.findMany({ orderBy: [{ Name: 'asc' }] });
    }

    getUserByUsername(username: string) {
        return this._db.wishUser.findFirst({ where: { Email: username } });
    }
}
