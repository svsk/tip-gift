<script setup lang="ts">
const loginAttempted = ref(false);

onMounted(() => {
    loginAttempted.value = window.location.href.includes('?auth');

    setTimeout(() => {
        if (!loginAttempted.value) {
            window.location.href = window.location.href + '?auth=' + crypto.randomUUID();
        }
    }, 2000);
});
</script>

<template>
    <div v-if="!loginAttempted">Logging you in, hold on!</div>
    <div v-else>Your login request couldn't be completed. Refresh the page and/or try again.</div>
</template>
