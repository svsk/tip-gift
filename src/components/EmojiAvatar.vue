<script setup lang="ts">
import { type WishUser } from '@prisma-app/client';

interface Props {
    user?: WishUser;
    color?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
    user: undefined,
    color: 'red',
});

const backgroundColor = computed(() => {
    const color = !!props.user?.AvatarColour ? props.user.AvatarColour : props.color;
    return `background-color: ${color || 'red'};`;
});
</script>

<template>
    <div
        class="min-h-[48px] min-w-[48px] text-center text-xl flex justify-center items-center rounded-full p-2 select-none"
        :style="`${backgroundColor}`"
    >
        <span v-if="user?.AvatarEmoji">
            {{ user.AvatarEmoji }}
        </span>
        <slot v-else> 🎄 </slot>
    </div>
</template>
