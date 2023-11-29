<script setup lang="ts">
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
</script>

<template>
    <LoginForm />
</template>
