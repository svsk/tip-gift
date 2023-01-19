import { WishUserGroup } from '@prisma/client';

const storeKey = 'userGroups';
const groupWishKey = 'userGroupWishes';
const groupUserKey = 'userGroupUsers';

export const useGroups = () =>
    useAsyncState(storeKey, () => $fetch('/api/groups/getall', useAuthentication()), { immediate: true });

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
    useAsyncState(`${groupWishKey}-${groupId}`, () => $fetch(`/api/groups/${groupId}/wishes`, useAuthentication()), {
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
    useAsyncState(`${groupUserKey}-${groupId}`, () => $fetch(`/api/groups/${groupId}/users`, useAuthentication()), {
        immediate: true,
    });

export const refreshGroups = async () => await (await useGroups()).refresh();
export const refreshGroupWishes = async (groupId: string) => await (await useGroupWishes(groupId)).refresh();
