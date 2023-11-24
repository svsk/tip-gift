<script setup lang="ts">
interface Props {
    group: {
        AvatarEmoji?: string | null;
        AvatarColour?: string | null;
    };
}

defineProps<Props>();
</script>

<template>
    <EmojiAvatar :color="group?.AvatarColour || 'red'"> {{ group?.AvatarEmoji || '🎄' }} </EmojiAvatar>
</template>
