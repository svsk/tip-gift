const shareKey = 'user-shares';

export const useShares = () =>
    useAsyncData(shareKey, () => $fetch('/api/wishes/share', useAuthentication()), {
        immediate: true,
    });

export const generateShareKey = async (listName: string) => {
    const share = await $fetch('/api/wishes/share', {
        body: { slug: listName },
        method: 'POST',
        ...useAuthentication(),
    });

    refreshShares();
    return share;
};

export const refreshShares = async () => await (await useShares()).refresh();
