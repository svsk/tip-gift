import { type WishPurchase } from '@prisma-app/client';
import type { WishPurchaseWish, WishTag } from '~/prisma/customTypes';

export const useMyWishPurchases = async () => {
    return await useFetch<WishPurchaseWish[]>('/api/wishpurchases', useAuthentication());
};

export const useGroupWishPurchases = async (groupId: string, fromCache = false) => {
    const storeKey = `groupWishPurchases-${groupId}`;

    const cached = fromCache ? retrieveCachedData<WishPurchase[]>(storeKey) : null;
    if (cached) {
        return cached;
    }

    return useAsyncData(storeKey, async () => {
        return await $fetch<WishPurchase[]>(`/api/groups/${groupId}/given`, useAuthentication());
    });
};

export const giveGift = async (groupId: string, wishId: string) => {
    await $fetch(`/api/groups/${groupId}/${wishId}/give`, {
        method: 'POST',
        ...useAuthentication(),
    });
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

export const deleteWishPurchase = async (wishPurchaseId: string, groupId: string) => {
    await $fetch(`/api/wishpurchases/${wishPurchaseId}`, {
        method: 'DELETE',
        ...useAuthentication(),
    });

    refreshGivenGifts(groupId);
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

export const refreshGivenGifts = async (groupId: string) => await useGroupWishPurchases(groupId);
