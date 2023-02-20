import { Ref } from 'vue';

interface AsyncStateOptions {
    immediate?: boolean;
}

interface AsyncStateReturnType<T> {
    execute: () => Promise<void>;
    refresh: () => Promise<void>;
    pending: Ref<boolean>;
    data: Ref<T | null>;
}

export async function useAsyncState<T>(
    key: string,
    fetchData: () => Promise<T>,
    options?: AsyncStateOptions
): Promise<AsyncStateReturnType<T>> {
    const data = useState<T | null>(key, () => null);
    const pending = useState(key + '-pending', () => false);

    const fetchNewData = async () => {
        pending.value = true;
        const response = await fetchData();
        data.value = response;
        pending.value = false;
    };

    const execute = async () => {
        await fetchNewData();
    };

    const refresh = async () => await fetchNewData();

    if (options?.immediate) {
        await execute();
    }

    return {
        execute,
        refresh,
        pending,
        data,
    };
}
