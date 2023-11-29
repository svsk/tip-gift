<script setup lang="ts">
const loginAttempted = ref(false);
const errorCode = ref<string | null>(null);
const errorDescription = ref<string | null>(null);
const user = useSupabaseUser();

watch(
    () => user,
    () => {
        if (user.value) {
            navigateTo('/');
        }
    },
    { immediate: true }
);

onMounted(() => {
    // get query parameters
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    errorCode.value = params.get('error_code');
    errorDescription.value = params.get('error_description');

    if (errorDescription.value?.includes('invalid or has expired')) {
        errorDescription.value += '. You may try again using a different email client or browser.';
    }

    if (error) {
        loginAttempted.value = true;
    }
});
</script>

<template>
    <Card class="py-16 w-full flex flex-col justify-center items-center">
        <div v-if="!loginAttempted" class="flex flex-col items-center justify-center gap-2">
            <div class="text-4xl">🔐</div>
            Logging you in, hold on!
        </div>
        <div v-else class="flex flex-col items-center justify-center gap-2">
            <div class="text-4xl">💥</div>
            <div class="text-center mb-2">Your login request couldn't be completed. Go back and/or try again.</div>
            <div v-if="errorDescription" class="mb-2 text-center text-sm text-gray-400">
                {{ errorCode }}: {{ errorDescription }}
            </div>
            <div>⬅️ <NuxtLink to="/" class="underline">Back </NuxtLink></div>
        </div>
    </Card>
</template>
