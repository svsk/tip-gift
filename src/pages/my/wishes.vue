<script setup lang="ts">
const termKey = 'MyWishes';
const title = computed(() => i18n(termKey));
watch(title, (newTitle) => usePageTitle(newTitle), { immediate: true });
</script>

<template>
    <Card>
        <MyWishList />
    </Card>
</template>
