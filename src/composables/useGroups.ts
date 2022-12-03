import { WishUserGroup } from '@prisma/client';

export const useGroups = () =>
    useAsyncData('userGroups', async () => {
        const cookie = useRequestHeaders(['cookie'])?.cookie || '';
        return await $fetch('/api/groups/getall', { headers: { cookie } });
    });

export const addGroup = async (group: WishUserGroup) => {
    const cookie = useRequestHeaders(['cookie'])?.cookie || '';
    return await $fetch('/api/groups/add', {
        method: 'POST',
        body: group,
        headers: { cookie },
    });
};

export const deleteGroup = async (group: WishUserGroup) => {
    const cookie = useRequestHeaders(['cookie'])?.cookie || '';

    return await $fetch('/api/groups/delete', {
        method: 'DELETE',
        query: { id: group.Id },
        headers: { cookie },
    });
};
