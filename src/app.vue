<script setup lang="ts">
const embedded = useRoute().query.embedded === 'true';

useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    ],
    link: [
        { rel: 'apple-touch-icon', href: '/touch-icon.png' },
        { rel: 'manifest', crossorigin: 'use-credentials', href: '/manifest.json' },
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

onMounted(() => {
    // Only on client side
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/js/service-worker-pwa.js');
    }
});
</script>

<template>
    <PullToRefresh>
        <NuxtLayout :name="layoutName">
            <NuxtPage />
        </NuxtLayout>
    </PullToRefresh>
</template>
