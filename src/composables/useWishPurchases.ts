import { type WishPurchase } from '@prisma-app/client';
import type { WishPurchaseWish, WishTag } from '~/prisma/customTypes';
import { withEnsuredSuccess } from './withClientCache';

export const useMyWishPurchases = async (forceReload = false) => {
    return withEnsuredSuccess(
        withClientCache<WishPurchaseWish[]>('myWishPurchases', '/api/wishpurchases', forceReload)
    );
};

export const useGroupWishPurchases = (groupId: string, forceReload = false) => {
    return withEnsuredSuccess(
        withClientCache<WishPurchase[]>(`groupWishPurchases-${groupId}`, `/api/groups/${groupId}/given`, forceReload)
    );
};

export const giveGift = async (groupId: string, wishId: string) => {
    await $fetch(`/api/groups/${groupId}/${wishId}/give`, {
        method: 'POST',
        ...useAuthentication(),
    });

    refreshGivenGifts(groupId);
};

export const updateWishPurchase = async (purchase: Partial<WishPurchase>) => {
    if (!purchase?.Id) {
        return;
    }

    await $fetch(`/api/wishpurchases/${purchase.Id}`, {
        body: purchase,
        method: 'PATCH',
        ...useAuthentication(),
    });
};

export const deleteWishPurchase = async (wishPurchaseId: string, groupId: string | null) => {
    await $fetch(`/api/wishpurchases/${wishPurchaseId}`, {
        method: 'DELETE',
        ...useAuthentication(),
    });

    refreshMyWishPurchases();
    if (groupId) {
        refreshGivenGifts(groupId);
    }
};

export const addCustomWishPurchase = async (customName: string, receiverName: string) => {
    await $fetch('/api/wishpurchases/custom', {
        body: { customName, receiverName },
        method: 'POST',
        ...useAuthentication(),
    });
};

export const useWishTag = async (wishPurchaseId: string) => {
    return await withClientCache<WishTag>(`wish-tag-${wishPurchaseId}`, `/api/wishtag/${wishPurchaseId}`);
};

export const updateWishTag = async (wishPurchaseId: string, tag: Partial<WishTag>) => {
    await $fetch(`/api/wishtag/${wishPurchaseId}`, {
        body: tag,
        method: 'PATCH',
        ...useAuthentication(),
    });
};

export const refreshGivenGifts = async (groupId: string) => await useGroupWishPurchases(groupId, true);
export const refreshMyWishPurchases = async () => await useMyWishPurchases(true);
