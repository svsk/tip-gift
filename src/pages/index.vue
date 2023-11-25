<script setup lang="ts">
const termKey = 'MainMenu';
const title = computed(() => i18n(termKey));
watch(title, (newTitle) => usePageTitle(newTitle), { immediate: true });
</script>

<template>
    <GroupMenu />
</template>
