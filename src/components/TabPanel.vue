<script setup lang="ts">
interface Props {
    name: string;
}

defineProps<Props>();

const tabContext = inject<{ activeTab: string }>('tabContext');
</script>

<template>
    <div v-show="name === tabContext?.activeTab">
        <slot />
    </div>
</template>
