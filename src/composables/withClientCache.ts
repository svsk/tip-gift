import type { AsyncData } from '#app';

const clientCache = new Map<string, AsyncData<any, any>>();

export const withClientCache = async <T>(dataKey: string, apiPath: string, forceReload = false) => {
    let asyncData = import.meta.client ? clientCache.get(dataKey) : null;

    if (import.meta.server || !asyncData) {
        // @ts-ignore
        asyncData = await useAsyncData<T>(dataKey, () => useRequestFetch()(apiPath));
    } else if (forceReload) {
        await asyncData.refresh();
    }

    if (import.meta.client && asyncData) {
        clientCache.set(dataKey, asyncData);
    }

    return asyncData as AsyncData<T, any>;
};
