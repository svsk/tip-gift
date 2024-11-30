<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    modelValue?: ((purchase: WishPurchaseWish) => boolean)[];
}

interface Emits {
    (event: 'update:modelValue', value: ((purchase: WishPurchaseWish) => boolean)[]): void;
}

enum StatusFilter {
    AwaitingPurchase = 'awaitingPurchase',
    Purchased = 'purchased',
    ShipmentReceived = 'shipmentReceived',
    Wrapped = 'wrapped',
    Given = 'given',
}

const { i18n } = await useI18n();

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filterCollection = ref<((purchase: WishPurchaseWish) => boolean)[]>([]);
const statusFilter = cachedRef<StatusFilter | null>('wishPurchaseListStatusFilter', null);

watchEffect(() => {
    if (props.modelValue !== filterCollection.value) {
        emit('update:modelValue', filterCollection.value);
    }
});

watchEffect(() => {
    const filters: ((purchase: WishPurchaseWish) => boolean)[] = [];

    if (statusFilter.value) {
        switch (statusFilter.value) {
            case StatusFilter.AwaitingPurchase:
                filters.push((purchase) => !purchase.PurchasedDate);
                break;
            case StatusFilter.Purchased:
                filters.push((purchase) => !!purchase.PurchasedDate && !purchase.ShipmentReceivedDate);
                break;
            case StatusFilter.ShipmentReceived:
                filters.push((purchase) => !!purchase.ShipmentReceivedDate && !purchase.WrappedDate);
                break;
            case StatusFilter.Wrapped:
                filters.push((purchase) => !!purchase.WrappedDate && !purchase.GivenDate);
                break;
            case StatusFilter.Given:
                filters.push((purchase) => !!purchase.GivenDate);
                break;
        }
    }

    filterCollection.value = filters;
});
</script>

<template>
    <div>
        <Button flat round>
            <Icon name="filter_list" font-size="24px" />
            <Menu>
                <Card class="shadow-xl flex flex-col gap-2">
                    <div>
                        <Localized tkey="ShowPurchasesWithStatus" />
                    </div>

                    <ButtonToggle
                        v-model="statusFilter"
                        vertical
                        togglable
                        :options="[
                            { value: StatusFilter.AwaitingPurchase, label: `💡 ${i18n('StatusAwaitingPurchase')}` },
                            { value: StatusFilter.Purchased, label: `🛍️ ${i18n('StatusPurchased')}` },
                            { value: StatusFilter.ShipmentReceived, label: `📦 ${i18n('StatusShipmentReceived')}` },
                            { value: StatusFilter.Wrapped, label: `🎁 ${i18n('StatusWrapped')}` },
                            { value: StatusFilter.Given, label: `❣️ ${i18n('StatusGiven')}` },
                        ]"
                    />
                </Card>
            </Menu>
        </Button>
    </div>
</template>
