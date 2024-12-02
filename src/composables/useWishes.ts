import { type Wish } from '@prisma-app/client';

const storeKey = 'wishes';

export const useWishes = (forceReload = false) => {
    return withEnsuredSuccess(withClientCache<Wish[]>(storeKey, '/api/wishes/getall', forceReload));
};

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

export const refreshWishes = async () => await useWishes(true);
