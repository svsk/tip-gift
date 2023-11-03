<script setup lang="ts">
const loginAttempted = ref(false);

const user = useSupabaseUser();
watch(
    user,
    () => {
        if (user.value) {
            return navigateTo('/');
        }
    },
    { immediate: true }
);
</script>

<template>
    <Card class="py-16 w-full flex flex-col justify-center items-center">
        <div v-if="!loginAttempted" class="flex flex-col items-center justify-center gap-2">
            <div class="text-4xl">🔐</div>
            Logging you in, hold on!
        </div>
        <div v-else class="flex flex-col items-center justify-center gap-2">
            <div class="text-4xl">💥</div>
            <div class="text-center">Your login request couldn't be completed. Go back and/or try again.</div>
            <div>⬅️ <NuxtLink to="/" class="underline">Back </NuxtLink></div>
        </div>
    </Card>
</template>
