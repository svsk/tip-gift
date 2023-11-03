import { type WishUser } from '@prisma-app/client';

const storeKey = (id: string) => `user-${id}`;

export const useUser = (id: string) =>
    useAsyncData(storeKey(id), () => $fetch<WishUser>(`/api/users/${id}`, useAuthentication()));

export const refreshUser = async (id: string) => await (await useUser(id)).refresh();

export const updateUser = async (user: WishUser) => {
    await $fetch('/api/users/update', {
        body: user,
        method: 'PATCH',
        ...useAuthentication(),
    });

    refreshUser(user.Id);
};

export const searchUsers = async (search: string) => {
    return await $fetch('/api/users/search', { query: { search }, ...useAuthentication() });
};
