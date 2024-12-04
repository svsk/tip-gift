import { usePrisma } from './usePrisma';

const excludeDeleted = {
    DeletedDate: null,
};

export class WishPurchaseNoteQueries {
    private _db = usePrisma();

    async getWishPurchaseNotes(userId: string) {
        return await this._db.wishPurchaseNote.findMany({
            where: {
                CreatedByUserId: userId,
                ...excludeDeleted,
            },
			orderBy: {
				CreatedDate: 'asc',
			},
        });
    }

    async getWishPurchaseNotesForWishPurchase(userId: string, wishPurchaseId: string) {
        return await this._db.wishPurchaseNote.findMany({
            where: {
                CreatedByUserId: userId,
                WishPurchaseId: wishPurchaseId,
                ...excludeDeleted,
            },
        });
    }

    async addWishPurchaseNote(userId: string, wishPurchaseId: string, note: string) {
        return await this._db.wishPurchaseNote.create({
            data: {
                WishPurchaseId: wishPurchaseId,
                CreatedByUserId: userId,
                Note: note,
            },
        });
    }

    async updateWishPurchaseNote(userId: string, wishPurchaseNoteId: string, note: string) {
        return await this._db.wishPurchaseNote.update({
            where: {
                Id: wishPurchaseNoteId,
                CreatedByUserId: userId,
            },
            data: {
                Note: note,
            },
        });
    }

    async deleteWishPurchaseNoteById(userId: string, wishPurchaseNoteId: string) {
        return await this._db.wishPurchaseNote.update({
            where: {
                Id: wishPurchaseNoteId,
                CreatedByUserId: userId,
            },
            data: {
                DeletedDate: new Date(),
                DeletedByUserId: userId,
            },
        });
    }
}
