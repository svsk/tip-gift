<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    wishPurchase: WishPurchaseWish;
}

const props = defineProps<Props>();

const showGiftTagDialog = ref(false);

const allowGoToStore = computed(() => {
    const { wishPurchase } = props;

    if (!wishPurchase.PurchasedDate) {
        return !!wishPurchase?.Link;
    }

    return false;
});

const allowShowQRCode = computed(() => {
    const { wishPurchase } = props;

    if (!wishPurchase.GivenDate && !!wishPurchase.WrappedDate) {
        return true;
    }

    return false;
});
</script>

<template>
    <div class="min-h-[36px]">
        <TransitionGroup name="slideUp">
            <div key="goToStore" v-if="allowGoToStore">
                <a :href="wishPurchase.Link" target="_blank">
                    <Button class="flex items-center flex-nowrap gap-2">
                        <Localized tkey="VisitStore" />
                        <Icon font-size="18px" name="open_in_new" />
                    </Button>
                </a>
            </div>

            <div key="showQRCode" v-if="allowShowQRCode">
                <Button class="flex items-center flex-nowrap gap-2" @click="showGiftTagDialog = true">
                    <Localized tkey="ShowQRCode" />
                    <Icon font-size="18px" name="qr_code_2" />
                </Button>
            </div>
        </TransitionGroup>

        <Dialog v-model="showGiftTagDialog">
            <template #title>
                <Localized tkey="GiftTag" />
            </template>

            <div class="w-full flex items-center justify-center">
                <WishPurchaseTag :wish-purchase="wishPurchase" />
            </div>
        </Dialog>
    </div>
</template>
