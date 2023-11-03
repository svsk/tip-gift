import { type WishUserGroup } from '@prisma-app/client';

const storeKey = 'userGroups';
const groupWishKey = 'userGroupWishes';
const groupUserKey = 'userGroupUsers';
const givenGroupGiftKey = 'givenGroupGifts';

export const useGroups = () =>
    useAsyncData(storeKey, () => $fetch('/api/groups/getall', useAuthentication()), { immediate: true });

export const addGroup = async (group: WishUserGroup) => {
    await $fetch('/api/groups/add', {
        method: 'POST',
        body: group,
        ...useAuthentication(),
    });

    refreshGroups();
};

export const updateGroup = async (group: WishUserGroup) => {
    await $fetch('/api/groups/update', {
        method: 'PATCH',
        body: group,
        ...useAuthentication(),
    });

    refreshGroups();
};

export const deleteGroup = async (group: WishUserGroup) => {
    await $fetch('/api/groups/delete', {
        method: 'DELETE',
        query: { id: group.Id },
        ...useAuthentication(),
    });

    refreshGroups();
};

export const useGroupWishes = (groupId: string) =>
    useAsyncData(`${groupWishKey}-${groupId}`, () => $fetch(`/api/groups/${groupId}/wishes`, useAuthentication()), {
        immediate: true,
    });

export const addWishToGroup = async (wishId: string, groupId: string) => {
    const result = await $fetch(`/api/groups/${groupId}/${wishId}`, {
        method: 'POST',
        ...useAuthentication(),
    });

    refreshGroupWishes(groupId);
    return result;
};

export const removeWishFromGroup = async (wishGroupWishId: string, groupId: string) => {
    const result = await $fetch(`/api/groups/${groupId}/${wishGroupWishId}`, {
        method: 'DELETE',
        ...useAuthentication(),
    });

    refreshGroupWishes(groupId);
    return result;
};

export const useGroupUsers = (groupId: string) =>
    useAsyncData(`${groupUserKey}-${groupId}`, () => $fetch(`/api/groups/${groupId}/users`, useAuthentication()), {
        immediate: true,
    });

export const addUserToGroup = async (groupId: string, userId: string) => {
    const result = await $fetch(`/api/groups/${groupId}/users/${userId}`, {
        method: 'POST',
        ...useAuthentication(),
    });

    refreshGroupUsers(groupId);
    return result;
};

export const giveGift = async (groupId: string, wishId: string) => {
    await $fetch(`/api/groups/${groupId}/${wishId}/give`, {
        method: 'POST',
        ...useAuthentication(),
    });
};

export const useGroupGivenGifts = (groupId: string) =>
    useAsyncData(`${givenGroupGiftKey}-${groupId}`, () => $fetch(`/api/groups/${groupId}/given`, useAuthentication()), {
        immediate: true,
    });

export const refreshGroups = async () => await (await useGroups()).refresh();
export const refreshGroupWishes = async (groupId: string) => await (await useGroupWishes(groupId)).refresh();
export const refreshGroupUsers = async (groupId: string) => await (await useGroupUsers(groupId)).refresh();
export const refreshGivenGifts = async (groupId: string) => await (await useGroupGivenGifts(groupId)).refresh();
