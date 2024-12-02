import type { AsyncData } from '#app';
import type { EffectScope } from 'vue';

let scope: EffectScope | null = null;
const clientCache = new Map<string, AsyncData<any, any>>();

export const withClientCache = async <T>(dataKey: string, apiPath: string, forceReload = false) => {
    try {
        let asyncData = import.meta.client ? clientCache.get(dataKey) : null;

        if (import.meta.server || !asyncData) {
            // @ts-ignore
            asyncData = await loadData(dataKey, apiPath);
        } else if (forceReload) {
            await asyncData.refresh();
        }

        if (import.meta.client && asyncData) {
            clientCache.set(dataKey, asyncData);
        }

        return asyncData as AsyncData<T, any>;
    } catch (err) {
        console.error('Failed to load data', dataKey);
        throw err;
    }
};

const loadData = async <T>(dataKey: string, apiPath: string) => {
    if (import.meta.client) {
        const instance = getCurrentInstance();
        const alreadyMounted = !instance || instance?.isMounted;
        if (alreadyMounted) {
            return await useClientAsyncData<T>(apiPath);
        }
    }

    // Always useAsyncData on the server side.
    return await useAsyncData<T>(dataKey, () => useRequestFetch()(apiPath));
};

export const withEnsuredSuccess = async <T>(get: Promise<{ data: Ref<T>; error: any; pending: Ref<boolean> }>) => {
    const result = await get;

    if (!result?.data?.value) {
        console.error('Failed to ensure success.', result?.error);
        throw new Error('Failed to ensure success.');
    }

    return result;
};

const useClientAsyncData = async <T>(apiPath: string) => {
    scope ??= effectScope(true);
    const clientAsyncData = scope.run(() => {
        // @ts-ignore
        return new ClientAsyncData<T>(() => useRequestFetch()(apiPath));
    });

    await clientAsyncData?.refresh();
    return clientAsyncData;
};

class ClientAsyncData<T> {
    data: Ref<T | null> = ref(null);
    error: Ref<any | null> = ref(null);
    loading = ref(false);
    refreshData: () => Promise<T>;

    constructor(refresh: () => Promise<T>) {
        this.refreshData = refresh;
    }

    async refresh() {
        this.loading.value = true;

        try {
            this.data.value = await this.refreshData();
        } catch (e) {
            console.error('failed to load client side');
            this.error.value = e;
        } finally {
            this.loading.value = false;
        }
    }
}
