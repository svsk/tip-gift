<script setup lang="ts">
interface Props {
    modelValue: string;
}

const props = defineProps<Props>();
const tabContext = reactive({
    activeTab: props.modelValue,
});

provide('tabContext', tabContext);

watch(
    () => props.modelValue,
    () => {
        tabContext.activeTab = props.modelValue;
    }
);
</script>

<template>
    <slot />
</template>
