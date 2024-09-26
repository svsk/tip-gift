<script setup lang="ts">
interface Props {
    modelValue: boolean | null;
    threeState?: boolean;
    size?: string | null;
}

interface Emits {
    (event: 'update:modelValue', value: boolean | null): void;
}

const props = withDefaults(defineProps<Props>(), { threeState: false, size: '1em' });
const emit = defineEmits<Emits>();

const value = ref<boolean | null>(false);

const handleClick = () => {
    if (props.threeState) {
        if (value.value === null) {
            value.value = false;
        } else {
            value.value = !value.value;
        }
    } else {
        value.value = !value.value;
    }
};

watch(
    () => props.modelValue,
    () => {
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
    <div class="cursor-pointer flex items-center gap-1" @click="handleClick">
        <!-- Make a nice looking checkbox, like material design -->
        <div
            :class="{
                'flex items-center gap-2 text-2xl relative  justify-center': true,
                [`w-[${size}] h-[${size}]`]: true,
            }"
        >
            <div v-if="value" class="h-[70%] w-[70%] bg-white absolute z-0 pointer-events-none" style="left: 15%"></div>
            <Icon :font-size="size || '1em'" class-name="text-blue-600 relative z-10" name="check_box" v-if="value" />
            <Icon :font-size="size || '1em'" name="check_box_outline_blank" v-else />
        </div>

        <slot />
    </div>
</template>

<style scoped lang="scss"></style>
