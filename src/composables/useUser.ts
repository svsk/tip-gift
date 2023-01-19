import { WishUser } from '@prisma/client';

const storeKey = (id: string) => `user-${id}`;

export const useUser = (id: string) =>
    useAsyncState(storeKey(id), () => $fetch<WishUser | null>(`/api/users/${id}`, useAuthentication()), {
        immediate: true,
    });

export const refreshUser = async (id: string) => await (await useUser(id)).refresh();

export const updateUser = async (user: WishUser) => {
    await $fetch('/api/users/update', {
        body: user,
        method: 'PATCH',
        ...useAuthentication(),
    });

    refreshUser(user.Id);
};
