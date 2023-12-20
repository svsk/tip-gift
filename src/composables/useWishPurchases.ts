import { type WishPurchase } from '@prisma-app/client';
import type { WishPurchaseWish, WishTag } from '~/prisma/customTypes';

export const useMyWishPurchases = async () => {
    return await useFetch<WishPurchaseWish[]>('/api/wishpurchases', useAuthentication());
};

export const useGroupWishPurchases = async (groupId: string) => {
    return await useFetch<WishPurchase[]>(`/api/groups/${groupId}/given`, useAuthentication());
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
    return await useFetch<WishTag>(`/api/wishtag/${wishPurchaseId}`);
};

export const refreshGivenGifts = async (groupId: string) => await useGroupWishPurchases(groupId);
