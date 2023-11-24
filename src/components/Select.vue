<script setup lang="ts">
import { random } from '~/composables/helpers';

interface Props {
    id?: string;
    readonly?: boolean;
    label?: string;
    modelValue: string | null | undefined;
    options: { label: string; value: string }[];
}

interface Emits {
    (event: 'update:modelValue', value: string | undefined | null): void;
}

const props = withDefaults(defineProps<Props>(), {
    id: 'v-input-' + random(),
    readonly: false,
});

const emit = defineEmits<Emits>();

const value = ref<string | null | undefined>(props.modelValue);

const errorMessage = computed(() => '');

watch(
    () => value.value,
    () => emit('update:modelValue', value.value)
);
</script>

<template>
    <div :class="{ 'relative input-container': true, 'has-value': value != null && value !== '' }">
        <label
            :for="id"
            v-if="label"
            class="label transition-all absolute top-[22%] left-[8px] opacity-50 pointer-events-none"
        >
            {{ label }}
        </label>

        <select
            v-model="value"
            :readonly="readonly"
            :class="{
                'border-b-2 border-blue-600 bg-black bg-opacity-20 rounded-t p-1 pb-2 pt-4 outline-none w-full text-base h-[50px]': true,
                // 'read-only:border-gray-400 read-only:border-dashed read-only:border-b': true,
                'border-red-500': !!errorMessage,
                'transition-colors': true,
            }"
        >
            <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
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
