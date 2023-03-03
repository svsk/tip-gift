import { NuxtApp } from '#app';
import { AsyncData } from 'nuxt/dist/app/composables';
import {
    AsyncDataExecuteOptions,
    AsyncDataOptions,
    KeyOfRes,
    PickFrom,
    _Transform,
} from 'nuxt/dist/app/composables/asyncData';

type AsyncDataResult<T> = PickFrom<ReturnType<_Transform<T>>, KeyOfRes<_Transform<T>>>;

export const useCachedAsyncData = <T>(
    cacheKey: string,
    handler: (ctx?: NuxtApp) => Promise<T>,
    options?: AsyncDataOptions<T>
): AsyncData<AsyncDataResult<T>, Error | null> => {
    // Used to prevent collisions in nuxt data. Low likelyhood that another property in
    // nuxt data starts with this.
    const CACHE_KEY_PRREFIX = 'CACHED_ASYNC_DATA';
    const { data: cachedData } = useNuxtData(cacheKey);
    const cacheKeyAsync = `${CACHE_KEY_PRREFIX}${cacheKey}`;
    const shouldRefresh = ref<boolean>(false);

    const asyncData = useAsyncData<T, Error>(
        cacheKey,
        async () => {
            await refreshNuxtData(cacheKeyAsync);
            // If we already have data, and we're not being forced to refresh, return cached data.
            if (cachedData.value && !shouldRefresh.value) {
                return cachedData.value;
            }
            const result = await handler();
            shouldRefresh.value = false;

            return result;
        },
        options
    );

    const refresh: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void> = async (
        opts?: AsyncDataExecuteOptions
    ) => {
        shouldRefresh.value = true;
        await asyncData.refresh(opts);
        shouldRefresh.value = false;
    };

    asyncData.then((e) => {
        if (e.error?.value) {
            console.warn(e.error.value);
        }
    });

    return { ...asyncData, refresh }; //as AsyncData<T, Error | null>;
};
