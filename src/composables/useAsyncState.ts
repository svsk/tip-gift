export const retrieveCachedData = <T>(cacheKey: string) => {
    const cached = useNuxtData<T>(cacheKey);
    if (cached.data.value) {
        return { data: cached.data, refresh: () => refreshNuxtData(cacheKey) };
    }

    return null;
};
