<script setup lang="ts">
interface Props {
    boughtItemName: string;
}

defineProps<Props>();
const currentLocation = ref('/');

onMounted(() => {
    currentLocation.value = window.location.origin + window.location.pathname;
});
</script>

<template>
    <div class="pb-4 text-lg">🎁 Excellent!</div>

    Visit TipGift to tell others that you've bought {{ boughtItemName }}!

    <div class="pt-4 flex w-full justify-between">
        <div>😸 Signing up is super easy!</div>

        <a :href="currentLocation" target="_parent">
            <Button>Visit TipGift</Button>
        </a>
    </div>
</template>
