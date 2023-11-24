<script setup lang="ts">
interface Props {
    options: { value: any; label: string }[];
    modelValue: any;
}

interface Emits {
    (event: 'update:modelValue', value: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const value = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newValue) => {
        value.value = newValue;
    }
);

watch(
    () => value.value,
    (newValue) => {
        emit('update:modelValue', newValue);
    }
);

const classes = computed(() => {
    // if (props.round) {
    //     return 'rounded-full bg-white p-2 bg-opacity-0 active:bg-opacity-10 flex items-center justify-center';
    // }

    // if (props.flat) {
    //     return 'rounded bg-opacity-0 bg-white py-2 px-4 active:bg-opacity-10 hover:bg-opacity-10';
    // }

    return `border-blue-600 border py-2 px-4`;
});

const buildBorderClass = (index: number) => {
    if (index === 0) {
        // Start button - no right borders
        return 'border-r-0 rounded-l';
    }

    if (index < props.options.length - 1) {
        // Middle button - no left or right borders
        return 'border-l-0 border-r-0';
    }

    // End button - no left borders
    return 'border-l-0 rounded-r';
};

const active = computed(() => 'bg-blue-600');
</script>

<template>
    <div class="flex flex-nowrap">
        <button
            v-ripple
            v-for="(option, index) in options"
            :key="option.value"
            :class="{
                'relative focus-visible:outline-none transition-all uppercase tracking-wide font-medium text-sm': true,
                [classes]: true,
                [buildBorderClass(index)]: true,
                [active]: option.value === value,
            }"
            @click="() => (value = option.value)"
        >
            {{ option.label }}
        </button>
    </div>
</template>
