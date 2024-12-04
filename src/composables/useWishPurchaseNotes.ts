import { type WishPurchaseNote } from '@prisma-app/client';

export const useWishPurchaseNotes = () => {
    const getWishPurchaseNotes = (forceReload = false) => {
        return withEnsuredSuccess(
            withClientCache<WishPurchaseNote[]>(`current-user-purchase-notes`, `/api/wishpurchases/notes`, forceReload)
        );
    };

    const refreshWishPurchaseNotes = () => getWishPurchaseNotes(true);

    const addWishPurchaseNote = async (wishPurchaseId: string, note: string) => {
        await $fetch(`/api/wishpurchases/${wishPurchaseId}/note`, {
            method: 'POST',
            body: { note },
            ...useAuthentication(),
        });

        refreshWishPurchaseNotes();
    }

    const deleteWishPurchaseNote = async (noteId: string) => {
        const { data: notes } = await getWishPurchaseNotes();
        const note = notes.value.find((n) => n.Id === noteId);

        if (!note) {
            return;
        }

        await $fetch(`/api/wishpurchases/${note.WishPurchaseId}/note/${note.Id}`, {
            method: 'DELETE',
            ...useAuthentication(),
        });

        refreshWishPurchaseNotes();
    }

    const updateWishPurchaseNote = async (noteId: string, newNoteText: string) => {
        const { data: notes } = await getWishPurchaseNotes();
        const note = notes.value.find((n) => n.Id === noteId);

        if (!note) {
            return;
        }

        await $fetch(`/api/wishpurchases/${note.WishPurchaseId}/note/${note.Id}`, {
            method: 'PATCH',
            body: { note: newNoteText },
            ...useAuthentication(),
        });

        refreshWishPurchaseNotes();
    }

    return {
        getWishPurchaseNotes,
        addWishPurchaseNote,
        deleteWishPurchaseNote,
        updateWishPurchaseNote,
    };
};
