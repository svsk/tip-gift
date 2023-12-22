<script setup lang="ts">
interface Props {
    name: string;
}

defineProps<Props>();

const tabContext = inject<{ activeTab: string; swapTab: (tabName: string) => void }>('tabContext');
</script>

<template>
    <div
        v-ripple
        :class="{
            'cursor-pointer px-4 py-2 border-b-2 relative': true,
            'border-b-blue-500': name === tabContext?.activeTab,
            'border-b-transparent': name !== tabContext?.activeTab,
        }"
        @click="tabContext?.swapTab(name)"
    >
        <slot />
    </div>
</template>
