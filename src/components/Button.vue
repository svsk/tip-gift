<script setup lang="ts">
interface Props {
    type?: 'button' | 'submit' | 'reset';
    round?: boolean;
    flat?: boolean;
    disable?: boolean;
    color?: string;
    noRipple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    round: false,
    flat: false,
    type: 'button',
    disable: false,
    color: 'bg-blue-600',
    noRipple: false,
});

const emit = defineEmits(['click']);

const classes = computed(() => {
    if (props.round) {
        return 'rounded-full bg-white p-2 bg-opacity-0 active:bg-opacity-10 flex items-center justify-center';
    }

    if (props.flat) {
        return 'rounded bg-opacity-0 bg-white py-2 px-4 active:bg-opacity-10 hover:bg-opacity-10';
    }

    return `rounded ${props.color} py-2 px-4`;
});
</script>

<template>
    <button
        v-ripple="!props.noRipple"
        :type="type"
        :disabled="disable"
        :class="{
            'relative focus-visible:outline-none transition-all uppercase tracking-wide font-medium text-sm': true,
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none': true,
            [classes]: true,
        }"
        @click="() => emit('click')"
    >
        <slot />
    </button>
</template>
