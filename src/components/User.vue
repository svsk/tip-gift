<script setup lang="ts">
interface Props {
    userId: string;
    withoutAvatar?: boolean;
    withoutUsername?: boolean;
    avatarClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    withoutAvatar: false,
    withoutUsername: false,
    avatarClass: '',
});

const user = await loadUser(props.userId);
</script>

<template>
    <span v-if="user">
        <EmojiAvatar :class="{ [avatarClass]: true }" v-if="!withoutAvatar" :user="user" />
        <span v-if="!withoutUsername">{{ user.Name }}</span>
    </span>
</template>
