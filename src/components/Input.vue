<script setup lang="ts">
interface Props {
    modelValue?: string;
    label?: string;
    inputClass?: string;
}

const props = defineProps<Props>();
const value = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div :class="{ 'relative input-container': true, 'has-value': !!value }">
        <div v-if="label" class="label transition-all absolute top-[22%] left-[8px] opacity-50 pointer-events-none">
            {{ label }}
        </div>
        <input
            :class="{
                [inputClass || '']: true,
                'border-b-2 border-blue-600 bg-black bg-opacity-20 rounded-t p-2 pt-4 outline-none w-full': true,
            }"
            v-model="value"
            @input="() => emit('update:modelValue', value)"
        />
    </div>
</template>

<style scoped lang="scss">
.input-container {
    &.has-value,
    &:focus-within {
        .label {
            font-size: 0.7em;
            top: 2px;
        }
    }
}

.label {
    font-size: 1em;
}
</style>
