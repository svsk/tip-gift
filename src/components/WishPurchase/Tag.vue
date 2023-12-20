<script setup lang="ts">
import * as QRCode from 'qrcode';
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchase: WishPurchaseWish;
}

const props = defineProps<Props>();

const tagData = ref<string | null>(null);

const baseUrl = computed(() => {
    return window.location.origin;
});

const url = computed(() => {
    return `${baseUrl.value}/gift-tag/${props.wishPurchase.Id}`;
});

watch(
    () => props.wishPurchase?.Id,
    async () => {
        tagData.value = await QRCode.toDataURL(url.value, { width: 200, color: { dark: '#fff', light: '#1e2a36' } });
    },
    { immediate: true }
);
</script>

<template>
    <div>
        <img v-if="tagData" :src="tagData" />
    </div>
</template>
