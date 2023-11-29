<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchase: WishPurchaseWish;
}

const props = defineProps<Props>();

const item = computed(() => props.wishPurchase);

const step = computed(() => {
    if (!item.value?.PurchasedDate) {
        return 1;
    }

    if (!item.value?.ShipmentReceivedDate) {
        return 2;
    }

    if (!item.value?.WrappedDate) {
        return 3;
    }

    if (!item.value?.GivenDate) {
        return 4;
    }

    return 5;
});

const handleResetAll = async () => {
    if (!item.value) {
        return;
    }

    item.value.PurchasedDate = null;
    item.value.ShipmentReceivedDate = null;
    item.value.WrappedDate = null;
    item.value.GivenDate = null;

    try {
        await updateWishPurchase(item.value);
    } catch {
        item.value.PurchasedDate = null;
    }
};

const handlePurchased = async () => {
    if (!item.value) {
        return;
    }

    item.value.PurchasedDate = item.value.PurchasedDate || new Date();
    item.value.ShipmentReceivedDate = null;
    item.value.WrappedDate = null;
    item.value.GivenDate = null;

    try {
        await updateWishPurchase(item.value);
    } catch {
        item.value.PurchasedDate = null;
    }
};

const handleShipmentReceived = async () => {
    if (!item.value) {
        return;
    }

    item.value.PurchasedDate = item.value.PurchasedDate || new Date();
    item.value.ShipmentReceivedDate = item.value.ShipmentReceivedDate || new Date();
    item.value.WrappedDate = null;
    item.value.GivenDate = null;

    try {
        await updateWishPurchase(item.value);
    } catch {
        item.value.ShipmentReceivedDate = null;
    }
};

const handleWrapped = async () => {
    if (!item.value) {
        return;
    }

    item.value.PurchasedDate = item.value.PurchasedDate || new Date();
    item.value.ShipmentReceivedDate = item.value.ShipmentReceivedDate || new Date();
    item.value.WrappedDate = item.value.WrappedDate || new Date();
    item.value.GivenDate = null;

    try {
        await updateWishPurchase(item.value);
    } catch {
        item.value.WrappedDate = null;
    }
};

const handleGiven = async () => {
    if (!item.value) {
        return;
    }

    item.value.PurchasedDate = item.value.PurchasedDate || new Date();
    item.value.ShipmentReceivedDate = item.value.ShipmentReceivedDate || new Date();
    item.value.WrappedDate = item.value.WrappedDate || new Date();
    item.value.GivenDate = item.value.GivenDate || new Date();

    try {
        await updateWishPurchase(item.value);
    } catch {
        item.value.GivenDate = null;
    }
};
</script>

<template>
    <Button
        no-ripple
        :class="{ 'state-button flex items-center flex-nowrap gap-1': true, mini: step !== 1 }"
        @click="() => (step === 1 ? handlePurchased() : handleResetAll())"
    >
        <div :class="{ icon: true, grayscale: step < 1 }">🛍️</div>
        <Localized class="text" tkey="MarkAsPurchased" />
    </Button>
    <Button
        no-ripple
        :class="{ 'state-button flex items-center flex-nowrap gap-1': true, mini: step !== 2 }"
        @click="step === 2 ? handleShipmentReceived() : handlePurchased()"
    >
        <div :class="{ icon: true, grayscale: step < 2 }">📦</div>
        <Localized class="text" tkey="MarkAsShipmentReceived" />
    </Button>
    <Button
        no-ripple
        :class="{ 'state-button flex items-center flex-nowrap gap-1': true, mini: step !== 3 }"
        @click="step === 3 ? handleWrapped() : handleShipmentReceived()"
    >
        <div :class="{ icon: true, grayscale: step < 3 }">🎁</div>
        <Localized class="text" tkey="MarkAsWrapped" />
    </Button>
    <Button
        no-ripple
        :class="{ 'state-button flex items-center flex-nowrap gap-1': true, mini: step !== 4 }"
        @click="step === 4 ? handleGiven() : handleWrapped()"
    >
        <div :class="{ icon: true, grayscale: step < 4 }">❣️</div>
        <Localized class="text" tkey="MarkAsGiven" />
    </Button>
</template>

<style scoped lang="scss">
.state-button {
    transition: all 0.2s linear;
    will-change: transform, height, width, padding, border-radius;

    * {
        transition: all 0.2s linear;
        will-change: transform;
    }

    &:not(.mini) {
        margin: 0px 10px;
    }

    .text {
        transform-origin: left;
        transition: all 0.1s linear;
    }

    &.mini {
        overflow: visible;
        background-color: theme('colors.blue.600');
        transform: translateY(8px);
        max-width: 10px;
        max-height: 10px;
        min-width: 10px;
        min-height: 10px;
        border-radius: 50%;
        height: 10px;
        width: 10px;
        padding: 0px;
        margin: 0px 10px;

        .icon {
            position: absolute;
            transform: translate(-4px, -20px);
        }

        .text {
            position: absolute;
            transform: scaleX(0);
        }
    }
}
</style>
