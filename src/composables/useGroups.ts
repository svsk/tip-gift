import { WishUserGroup } from '@prisma/client';

const storeKey = 'userGroups';

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

export const deleteGroup = async (group: WishUserGroup) => {
    await $fetch('/api/groups/delete', {
        method: 'DELETE',
        query: { id: group.Id },
        ...useAuthentication(),
    });

    refreshGroups();
};

export const refreshGroups = async () => await (await useGroups()).refresh();
