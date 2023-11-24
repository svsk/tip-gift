<script setup lang="ts">
interface Props {
    modelValue: string | null;
}

interface Emits {
    (event: 'update:modelValue', value: string | null): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const value = ref(props.modelValue);
const colorPicker = ref<any>(null);

watch(
    () => value.value,
    () => emit('update:modelValue', value.value)
);

watch(
    () => props.modelValue,
    () => (value.value = props.modelValue)
);

const handleButtonClicked = () => {
    colorPicker.value?.click();
};

const handleColorChanged = (color: string) => {
    value.value = color;
};
</script>

<template>
    <Button @click="handleButtonClicked" round style="height: 45px; width: 45px">
        <Icon font-size="24px" name="palette" />
        <input
            ref="colorPicker"
            type="color"
            :value="value"
            @input="(e: any) => handleColorChanged(e.target.value)"
            class="fixed scale-0"
        />
    </Button>
</template>
