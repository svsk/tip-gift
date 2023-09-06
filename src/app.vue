<script setup lang="ts">
const embedded = useRoute().query.embedded === 'true';

useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    ],
});

const layoutName = embedded ? 'embed' : 'default';

if (layoutName === 'embed') {
    useHead({
        bodyAttrs: {
            class: 'embedded',
        },
    });
}
</script>

<template>
    <div>
        <NuxtLayout :name="layoutName">
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
