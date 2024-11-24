<script setup lang="ts">
import { type WishUser } from '@prisma-app/client';

interface Props {
    user?: WishUser;
    color?: string | null;
    size?: string;
}

const props = withDefaults(defineProps<Props>(), {
    user: undefined,
    color: 'red',
    size: '48px',
});

const backgroundColor = computed(() => {
    const color = !!props.user?.AvatarColour ? props.user.AvatarColour : props.color;
    return `background-color: ${color || 'red'};`;
});
</script>

<template>
    <div
        class="text-center text-xl flex justify-center items-center rounded-full p-2 select-none aspect-square"
        :style="`${backgroundColor} height: ${props.size}; width: ${props.size};`"
    >
        <span v-if="user?.AvatarEmoji">
            {{ user.AvatarEmoji }}
        </span>
        <slot v-else> 🎄 </slot>
    </div>
</template>
