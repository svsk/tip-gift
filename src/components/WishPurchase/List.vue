<script setup lang="ts">
import type { Form } from '#build/components';

const { data: purchases, refresh: refreshPurchases } = await useMyWishPurchases();

const filterGiven = cachedRef('filter-completed-wish-purchases', true);

const showAddCustomWishPurchaseDialog = ref(false);
const customForm = ref<InstanceType<typeof Form> | null>(null);
const customArgs = ref<{ customName: string; receiverName: string }>({ customName: '', receiverName: '' });

const sortedPurchases = computed(() => {
    return Array.from(purchases.value || [])
        .filter((p) => {
            if (filterGiven.value && !!p.GivenDate) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            return `${a.ReceiverName}${a.WishOwnerId}`.localeCompare(`${b.ReceiverName}${b.WishOwnerId}`);
        });
});

const handleAddCustomPurchase = () => {
    customArgs.value = { customName: '', receiverName: '' };
    showAddCustomWishPurchaseDialog.value = true;
};

const handleAddCustomPurchaseConfirmed = async () => {
    const isValid = customForm.value?.validate();

    if (!isValid) {
        return;
    }

    await addCustomWishPurchase(customArgs.value.customName, customArgs.value.receiverName);
    refreshPurchases();

    showAddCustomWishPurchaseDialog.value = false;
};
</script>

<template>
    <div class="flex flex-col w-full">
        <div class="w-full flex items-center justify-end pb-4">
            <WishPurchaseListFilter v-model:filter-given="filterGiven" />
        </div>

        <div
            v-ripple
            class="cursor-pointer border-t first:border-t-0 py-2 flex flex-row items-center flex-nowrap gap-3 w-full justify-between relative rounded border-slate-600"
            @click="handleAddCustomPurchase"
        >
            <div class="flex gap-2 items-center text-sm">
                <div>
                    <div
                        class="ml-1 rounded-full min-h-[48px] min-w-[48px] bg-slate-700 text-white flex items-center justify-center"
                    >
                        <Icon font-size="32px" name="add" />
                    </div>
                </div>

                <Localized tkey="AddCustomWishPurchase" />
            </div>
            <div></div>
        </div>

        <Dialog
            v-model="showAddCustomWishPurchaseDialog"
            with-confirm
            @confirm="handleAddCustomPurchaseConfirmed"
            @cancel="showAddCustomWishPurchaseDialog = false"
        >
            <template #title>
                <Localized tkey="AddCustomWishPurchase" />
            </template>

            <Form ref="customForm">
                <WishPurchaseAddCustomForm :args="customArgs" />
            </Form>
        </Dialog>

        <TransitionGroup name="growDownSlow">
            <NuxtLink
                v-for="purchase in sortedPurchases"
                v-ripple
                :key="purchase.Id"
                class="border-t first:border-t-0 py-2 flex flex-row items-center flex-nowrap gap-3 w-full justify-between relative rounded border-slate-600"
                :to="`/my/checklist/${purchase.Id}`"
            >
                <User v-if="purchase.WishOwnerId" :user-id="purchase.WishOwnerId" without-username class="ml-1" />
                <EmojiAvatar v-else color="rgb(37 99 235)"> 🙋 </EmojiAvatar>

                <div class="flex flex-col flex-1 gap-1 text-sm">
                    <div class="line-clamp-2">
                        {{ purchase.Name }}
                    </div>

                    <WishPurchaseProgress :wish-purchase="purchase" />
                </div>

                <div>
                    <Button round flat>
                        <Icon font-size="24px" name="navigate_next" />
                    </Button>
                </div>
            </NuxtLink>
        </TransitionGroup>
    </div>
</template>
