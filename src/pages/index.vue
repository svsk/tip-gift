<script setup lang="ts">
const termKey = 'MyWishLists';
const title = computed(() => i18n(termKey));
watch(title, (newTitle) => usePageTitle(newTitle), { immediate: true });

definePageMeta({
    pageTransition: {
        name: 'slideLeft',
        mode: 'out-in',
        duration: 1000,
    },
});
</script>

<template>
    <GroupMenu />
</template>
