import { usePrisma } from './usePrisma';

export class DbContext {
    private _db = usePrisma();

    getWishes() {
        return this._db.wish.findMany({ orderBy: [{ Order: 'asc' }] });
    }
}
