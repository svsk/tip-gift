<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchase: WishPurchaseWish;
}

const props = defineProps<Props>();

const isBought = computed(() => !!props.wishPurchase.PurchasedDate);
const isShipmentReceived = computed(() => !!props.wishPurchase.ShipmentReceivedDate);
const isWrapped = computed(() => !!props.wishPurchase.WrappedDate);
const isGiven = computed(() => !!props.wishPurchase.GivenDate);
</script>

<template>
    <div class="flex flex-row items-center gap-2">
        <div :class="{ grayscale: !isBought, 'text-xl': true }">🛍️</div>
        <div :class="{ grayscale: !isShipmentReceived, 'text-xl': true }">📦</div>
        <div :class="{ grayscale: !isWrapped, 'text-xl': true }">🎁</div>
        <div :class="{ grayscale: !isGiven, 'text-xl': true }">❣️</div>
    </div>
</template>
