<script setup lang="ts">
definePageMeta({
    pageTransition: {
        name: 'slideIn',
        mode: 'out-in',
        duration: 1000,
    },
});

const wishPurchaseId = useRoute().params.wishPurchaseId.toString();

const { data: purchases } = await useMyWishPurchases();

const item = computed(() => purchases.value?.find((p) => p.Id === wishPurchaseId));

const handlePurchased = async () => {
    if (!item.value) {
        return;
    }

    item.value.PurchasedDate = new Date();
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

    item.value.ShipmentReceivedDate = new Date();
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

    item.value.WrappedDate = new Date();
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

    item.value.GivenDate = new Date();
    try {
        await updateWishPurchase(item.value);
    } catch {
        item.value.GivenDate = null;
    }
};
</script>

<template>
    <Card class="relative" v-if="item">
        <PageHeader back-to="/my/checklist">
            {{ item?.Name }}
        </PageHeader>

        <div v-if="item?.WishOwnerId" class="w-full text-center pt-4 text-sm">
            <Localized tkey="GiftFor" /><br />
            <User :user-id="item?.WishOwnerId" without-avatar class="text-xl" />
        </div>

        <div class="mt-12 w-full relative h-[210px] flex flex-col justify-between items-center">
            <div class="absolute z-10 w-full flex items-center justify-center top-[60px]">
                <TransitionGroup name="slidePast">
                    <div key="5" v-if="item.GivenDate" class="absolute text-[140px] leading-[1em]">❣️</div>
                    <div key="4" v-if="item.WrappedDate && !item.GivenDate" class="absolute text-[140px] leading-[1em]">
                        🎁
                    </div>
                    <img
                        key="3"
                        v-if="item.ShipmentReceivedDate && !item.WrappedDate && item.ImageUrl"
                        class="absolute h-[140px] w-[140px]"
                        :src="item?.ImageUrl"
                    />
                    <div
                        key="2"
                        v-if="item.PurchasedDate && !item.ShipmentReceivedDate"
                        class="absolute text-[140px] leading-[1em]"
                    >
                        📦
                    </div>
                    <div key="1" v-if="!item.PurchasedDate" class="absolute text-[140px] leading-[1em]">🛍️</div>
                </TransitionGroup>
            </div>

            <div></div>

            <!-- make sure the svg doesnt go outside the page -->
            <svg style="width: 100%; opacity: 0.4; max-width: 400px">
                <!-- create oval ellipse that doesn't stretch beyond the size of the parent svg -->
                <ellipse cx="50%" cy="50%" rx="50%" ry="25%" fill="gray" />
            </svg>
        </div>

        <div v-if="item" class="w-full flex items-center justify-center">
            <Button v-if="!item.PurchasedDate" @click="handlePurchased">
                <Localized tkey="MarkAsPurchased" />
            </Button>
            <Button v-else-if="!item.ShipmentReceivedDate" @click="handleShipmentReceived">
                <Localized tkey="MarkAsShipmentReceived" />
            </Button>
            <Button v-else-if="!item.WrappedDate" @click="handleWrapped">
                <Localized tkey="MarkAsWrapped" />
            </Button>
            <Button v-else-if="!item.GivenDate" @click="handleGiven">
                <Localized tkey="MarkAsGiven" />
            </Button>
        </div>
    </Card>
</template>

<style scoped lang="scss"></style>
