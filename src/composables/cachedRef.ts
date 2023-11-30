export const cachedRef = <T>(cacheKey: string, defaultValue: T) => {
    const theRef = ref(defaultValue);

    onMounted(() => {
        const cachedValue = localStorage.getItem(cacheKey);

        if (cachedValue) {
            try {
                theRef.value = JSON.parse(cachedValue);
            } catch {
                console.warn('Failed to parse cached value for:', cacheKey);
            }
        }
    });

    watch(
        () => theRef,
        () => {
            localStorage.setItem(cacheKey, JSON.stringify(theRef.value));
        },
        { deep: true }
    );

    return theRef;
};
