<script setup lang="ts">
import { WishUser } from '.prisma/client';

interface Props {
    user?: WishUser;
}

const props = withDefaults(defineProps<Props>(), {
    user: undefined,
});

const backgroundColor = computed(() =>
    !!props.user ? (props.user.AvatarColour ? `background-color: ${props.user?.AvatarColour}` : '') : ''
);
</script>

<template>
    <div
        class="h-[48px] w-[48px] text-center text-xl flex justify-center items-center rounded-full p-2 select-none bg-red-600"
        :style="`${backgroundColor}`"
    >
        <span v-if="user?.AvatarEmoji">
            {{ user.AvatarEmoji }}
        </span>
        <span v-else> 🎄 </span>
    </div>
</template>
