<script setup lang="ts">
const termKey = 'MyWishLists';
const title = computed(() => i18n(termKey));
watch(title, (newTitle) => usePageTitle(newTitle), { immediate: true });
</script>

<template>
    <GroupMenu />
</template>
