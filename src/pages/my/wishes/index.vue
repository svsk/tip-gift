<script setup lang="ts">
definePageMeta({
    pageTransition: {
        name: 'slideLeft',
        mode: 'out-in',
        duration: 1000,
    },
});

const termKey = 'MyWishes';
const title = computed(() => i18n(termKey));
watch(title, (newTitle) => usePageTitle(newTitle), { immediate: true });
</script>

<template>
    <Card>
        <MyWishList />
    </Card>
</template>
