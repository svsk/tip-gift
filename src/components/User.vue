<script setup lang="ts">
interface Props {
    userId: string;
}

const props = defineProps<Props>();

const { data: user } = await useUser(props.userId);
</script>

<template>
    <div v-if="user">
        <EmojiAvatar :user="user" />
        <span>{{ user.Name }}</span>
    </div>
</template>
