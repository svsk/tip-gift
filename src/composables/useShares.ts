const shareKey = 'wish-shares';

export const useShares = () =>
    useAsyncData(shareKey, async () => {
        return await $fetch('/api/wishes/share', useAuthentication());
    });
