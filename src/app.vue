<script setup lang="ts">
import { useBodyAttrs, useTagMeta } from '@unhead/vue';

const embedded = useRoute().query.embedded === 'true';

useTagMeta([
    { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
]);

const layoutName = embedded ? 'embed' : 'default';

if (layoutName === 'embed') {
    useBodyAttrs({
        class: 'embedded',
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
