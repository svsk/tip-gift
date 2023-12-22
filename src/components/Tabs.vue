<script setup lang="ts">
interface Props {
    modelValue: string;
}

interface Emits {
    (event: 'update:modelValue', value: string): boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const tabContext = reactive({
    activeTab: props.modelValue,
    swapTab: (name: string) => {
        tabContext.activeTab = name;
    },
});

provide('tabContext', tabContext);

watch(
    () => props.modelValue,
    () => {
        tabContext.activeTab = props.modelValue;
    }
);

watch(
    () => tabContext.activeTab,
    () => {
        emit('update:modelValue', tabContext.activeTab);
    }
);
</script>

<template>
    <div class="flex no-wrap w-full border-b border-gray-600">
        <slot />
    </div>
</template>
