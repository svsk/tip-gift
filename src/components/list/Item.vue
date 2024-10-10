<script setup lang="ts">
interface Props {
    clickable?: boolean;
}

defineProps<Props>();
</script>

<template>
    <div
        v-ripple="clickable"
        :class="{
            'flex items-center gap-1 rounded-lg bg-white bg-opacity-5 px-3 py-3 relative': true,
            'cursor-pointer': clickable,
        }"
    >
        <slot />
    </div>
</template>
