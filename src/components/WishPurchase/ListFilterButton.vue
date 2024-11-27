<script setup lang="ts">
import type { WishPurchaseWish } from '~/prisma/customTypes';

interface Props {
    modelValue?: ((purchase: WishPurchaseWish) => boolean)[];
}

interface Emits {
    (event: 'update:modelValue', value: ((purchase: WishPurchaseWish) => boolean)[]): void;
}

const { i18n } = await useI18n();

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filterCollection = ref<((purchase: WishPurchaseWish) => boolean)[]>([]);

enum Filter {
    Purchased = 'purchased',
    ShipmentReceived = 'shipmentReceived',
    Wrapped = 'wrapped',
    Given = 'given',
    AwaitingPurchase = 'awaitingPurchase',
}

const statusFilter = ref<Filter | null>(null);

watchEffect(() => {
    if (props.modelValue !== filterCollection.value) {
        emit('update:modelValue', filterCollection.value);
    }
});

watchEffect(() => {
    const filters: ((purchase: WishPurchaseWish) => boolean)[] = [];

    if (statusFilter.value) {
        switch (statusFilter.value) {
            case Filter.AwaitingPurchase:
                filters.push((purchase) => !purchase.PurchasedDate);
                break;
            case Filter.Purchased:
                filters.push((purchase) => !!purchase.PurchasedDate && !purchase.ShipmentReceivedDate);
                break;
            case Filter.ShipmentReceived:
                filters.push((purchase) => !!purchase.ShipmentReceivedDate && !purchase.WrappedDate);
                break;
            case Filter.Wrapped:
                filters.push((purchase) => !!purchase.WrappedDate && !purchase.GivenDate);
                break;
            case Filter.Given:
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
                        :options="[
                            { value: Filter.AwaitingPurchase, label: `💡 ${i18n('StatusAwaitingPurchase')}` },
                            { value: Filter.Purchased, label: `🛍️ ${i18n('StatusPurchased')}` },
                            { value: Filter.ShipmentReceived, label: `📦 ${i18n('StatusShipmentReceived')}` },
                            { value: Filter.Wrapped, label: `🎁 ${i18n('StatusWrapped')}` },
                            { value: Filter.Given, label: `❣️ ${i18n('StatusGiven')}` },
                        ]"
                    />
                </Card>
            </Menu>
        </Button>
    </div>
</template>
