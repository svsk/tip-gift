<script setup lang="ts">
interface Props {
    modelValue: boolean | null;
    threeState?: boolean;
}

interface Emits {
    (event: 'update:modelValue', value: boolean | null): void;
}

const props = withDefaults(defineProps<Props>(), { threeState: false });
const emit = defineEmits<Emits>();

const value = ref<boolean | null>(false);

watch(
    () => props.modelValue,
    () => {
        console.log('setting new value', props.modelValue);
        value.value = props.modelValue;
    },
    { immediate: true }
);

watch(
    () => value.value,
    () => emit('update:modelValue', value.value)
);
</script>

<template>
    <div>
        <!-- Make a nice looking checkbox, like material design -->
        <div class="flex items-center gap-2 text-2xl">
            <!-- <input type="checkbox" v-model="value" class="rounded-sm border border-gray-300 w-4 h-4" /> -->

            <Icon class-name="text-blue-600" name="check_box" v-if="value" />
            <Icon name="check_box_outline_blank" v-else />

            <div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
