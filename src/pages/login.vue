<script setup lang="ts">
const { ready, loggedIn } = useUserSession();

watchEffect(() => {
    if (!ready.value) {
        return;
    }

    if (loggedIn.value) {
        navigateTo('/');
    }

    if (window) {
        window.location.href = '/api/auth/auth0';
    }
});
</script>

<template>
    <div></div>
</template>
