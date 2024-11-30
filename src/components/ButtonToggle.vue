<script setup lang="ts">
interface Props {
    options: { value: any; label: string }[];
    vertical?: boolean;
    modelValue: any;
    togglable?: boolean;
}

interface Emits {
    (event: 'update:modelValue', value: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const value = ref(props.modelValue);

const classes = computed(() => {
    // if (props.round) {
    //     return 'rounded-full bg-white p-2 bg-opacity-0 active:bg-opacity-10 flex items-center justify-center';
    // }

    // if (props.flat) {
    //     return 'rounded bg-opacity-0 bg-white py-2 px-4 active:bg-opacity-10 hover:bg-opacity-10';
    // }

    return `border-blue-600 border py-2 px-4`;
});

const active = computed(() => 'bg-blue-600');

const buildBorderHorizontalClass = (index: number) => {
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

const buildBorderVerticalClass = (index: number) => {
    if (index === 0) {
        // Start button - no bottom borders
        return 'border-b-0 rounded-t';
    }

    if (index < props.options.length - 1) {
        // Middle button - no top or bottom borders
        return 'border-t-0 border-b-0';
    }

    // End button - no top borders
    return 'border-t-0 rounded-b';
};

const handleClick = (clickedValue: string) => {
    if (props.togglable && value.value === clickedValue) {
        value.value = null;
    } else {
        value.value = clickedValue;
    }
};

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
</script>

<template>
    <div :class="{ 'flex flex-nowrap': true, 'flex-col': vertical }">
        <button
            v-ripple
            v-for="(option, index) in options"
            :key="option.value"
            :class="{
                'relative focus-visible:outline-none transition-all uppercase tracking-wide font-medium text-sm flex-grow': true,
                [classes]: true,
                [buildBorderHorizontalClass(index)]: !vertical,
                [buildBorderVerticalClass(index)]: !!vertical,
                [active]: option.value === value,
            }"
            @click="(_) => handleClick(option.value)"
        >
            {{ option.label }}
        </button>
    </div>
</template>
