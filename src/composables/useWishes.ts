import { Wish } from '@prisma/client';

const storeKey = 'wishes';
const shareKey = 'wish-shares';

export const useWishes = () =>
    useAsyncData(storeKey, async () => {
        return await $fetch('/api/wishes/getall', useAuthentication());
    });

export const addWish = async (wish: Wish) => {
    const result = await $fetch('/api/wishes/add', {
        body: wish,
        method: 'POST',
        ...useAuthentication(),
    });

    refreshWishes();
    return result;
};

export const deleteWish = async (wish: Wish) => {
    const result = await $fetch('/api/wishes/delete', {
        query: { id: wish.Id },
        method: 'DELETE',
        ...useAuthentication(),
    });

    refreshWishes();
    return result;
};

export const updateWishes = async (wishes: Wish[]) => {
    await $fetch('/api/wishes/update-many', {
        body: wishes,
        method: 'PATCH',
        ...useAuthentication(),
    });

    refreshWishes();
};

export const generateShareKey = async (listName: string) => {
    return await $fetch('/api/wishes/share', {
        body: { slug: listName },
        method: 'POST',
        ...useAuthentication(),
    });
};

export const refreshWishes = () => refreshNuxtData(storeKey);
