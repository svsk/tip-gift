import { type Wish } from '@prisma-app/client';

const storeKey = 'wishes';

export const useWishes = () =>
    useAsyncData(
        storeKey,
        async () => {
            const result = await $fetch('/api/wishes/getall', useAuthentication());
            return result?.map((wish) => ({ ...wish, CreatedDate: new Date(wish.CreatedDate) } as Wish));
        },
        { immediate: true }
    );

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

export const refreshWishes = async () => await (await useWishes()).refresh();
