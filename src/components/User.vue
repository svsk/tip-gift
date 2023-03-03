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

const userResult = useUser(props.userId);
const user = userResult.data;

const updateUser = async () => {
    try {
        const userResponse = useUser(props.userId);
        user.value = userResponse.data.value;
    } catch (err: any) {
        console.error(err);
    }
};

watch(() => props.userId, updateUser);
</script>

<template>
    <span v-if="user">
        <EmojiAvatar :class="{ [avatarClass]: true }" v-if="!withoutAvatar" :user="user" />
        <span v-if="!withoutUsername">{{ user.Name }}</span>
    </span>
</template>
