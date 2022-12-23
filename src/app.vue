<script setup lang="ts">
import { useBodyAttrs } from '@unhead/vue';

const { embedded } = useRoute().query;

const layoutName = embedded === 'true' ? 'embed' : 'default';

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
