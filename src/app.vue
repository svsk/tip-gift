<script setup lang="ts">
import { useBodyAttrs } from '@unhead/vue';

const embedded = useRoute().query.embedded === 'true';

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
