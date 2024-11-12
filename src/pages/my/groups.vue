<script setup lang="ts">
const termKey = 'MyGroups';
const { i18n } = await useI18n();
const title = computed(() => i18n(termKey));
watch(title, (newTitle) => usePageTitle(newTitle), { immediate: true });
</script>

<template>
    <GroupMenu />
</template>
