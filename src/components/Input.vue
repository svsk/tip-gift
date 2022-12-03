<script setup lang="ts">
interface Props {
    modelValue?: string;
    label?: string;
}

defineProps<Props>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div :class="{ 'relative input-container': true, 'has-value': true }">
        <div v-if="label" class="label transition-all absolute top-[22%] left-[8px] opacity-50 pointer-events-none">
            {{ label }}
        </div>
        <input
            :value="modelValue"
            @input="(val) => emit('update:modelValue', (val.target as any).value)"
            class="border-b-2 border-blue-600 bg-black bg-opacity-20 rounded-t p-2 pt-4 outline-none w-full"
        />
    </div>
</template>

<style scoped lang="scss">
.input-container:focus-within {
    .label {
        font-size: 0.7em;
        top: 2px;
    }
}

.label {
    font-size: 1em;
}
</style>
