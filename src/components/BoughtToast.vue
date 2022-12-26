<script setup lang="ts">
interface Props {
    boughtItemName: string;
}

defineProps<Props>();
</script>

<template>
    <div class="pb-4 text-lg">🎁 Excellent!</div>

    Sign in to tell others that you've bought {{ boughtItemName }}!

    <div class="pt-4 flex w-full justify-between">
        <div>😸 Logging in is super easy!</div>

        <NuxtLink to="/login">
            <Button>Log In</Button>
        </NuxtLink>
    </div>
</template>
