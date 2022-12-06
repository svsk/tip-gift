<script setup lang="ts">
interface Props {
    modelValue?: string | number | null;
    label?: string;
    inputClass?: string;
    type?: string;
    step?: string;
    readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    readonly: false,
});
const emit = defineEmits(['update:modelValue']);

watch(
    () => props.modelValue,
    () => (value.value = props.modelValue)
);

const value = ref(props.modelValue);
const input = ref<any>(null);

watch(
    () => value.value,
    () => {
        if (value.value !== props.modelValue) {
            emit('update:modelValue', value.value);
        }
    }
);

const focus = () => {
    input.value?.focus();
};

defineExpose({
    focus,
});
</script>

<template>
    <div :class="{ 'relative input-container': true, 'has-value': value != null && value !== '' }">
        <div v-if="label" class="label transition-all absolute top-[22%] left-[8px] opacity-50 pointer-events-none">
            {{ label }}
        </div>
        <input
            ref="input"
            :readonly="readonly"
            :step="step"
            :type="type"
            :class="{
                [inputClass || '']: true,
                'border-b-2 border-blue-600 bg-black bg-opacity-20 rounded-t p-2 pt-4 outline-none w-full text-base': true,
                'read-only:border-gray-400 read-only:border-dashed read-only:border-b': true,
            }"
            v-model="value"
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
