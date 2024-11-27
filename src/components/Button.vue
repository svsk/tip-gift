<script setup lang="ts">
interface Props {
    type?: 'button' | 'submit' | 'reset';
    round?: boolean;
    outlined?: boolean;
    flat?: boolean;
    disable?: boolean;
    color?: string;
    noRipple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    round: false,
    flat: false,
    outlined: false,
    type: 'button',
    disable: false,
    color: 'bg-blue-600',
    noRipple: false,
});

const emit = defineEmits(['click']);

const classes = computed(() => {
    if (props.round) {
        return 'rounded-full bg-white p-2 bg-opacity-0 active:bg-opacity-10 flex items-center justify-center aspect-square';
    }

    if (props.flat) {
        return 'rounded border border-transparent bg-opacity-0 bg-white py-2 px-4 active:bg-opacity-10 hover:bg-opacity-10';
    }

    if (props.outlined) {
        return `rounded border border-blue-600 border-solid bg-transparent py-2 px-4`;
    }

    return `rounded border border-transparent ${props.color} py-2 px-4`;
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
