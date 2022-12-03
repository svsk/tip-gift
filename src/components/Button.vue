<script setup lang="ts">
interface Props {
    type?: 'button' | 'submit' | 'reset';
    round?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    round: false,
    type: 'button',
});

const emit = defineEmits(['click']);

const classes = computed(() => {
    if (props.round) {
        return 'rounded-full bg-white p-2 bg-opacity-0 active:bg-opacity-10';
    }

    return 'rounded bg-blue-600 py-2 px-4';
});
</script>

<template>
    <button :type="type" :class="classes" @click="() => emit('click')">
        <slot />
    </button>
</template>
