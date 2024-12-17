<script setup lang="ts">
import { type ListItem, type Form } from '#build/components';
import type { WishPurchaseWish } from '~/prisma/customTypes';

const { data: purchases } = await useMyWishPurchases();
const { i18n } = await useI18n();

const filterGiven = cachedRef('filter-completed-wish-purchases', true);
const freeTextSearch = cachedRef('checklist-freetext-search', '');
const selectedTab = cachedRef<'checklist' | 'tags'>('checklist-selected-tab', 'checklist');

const showAddCustomWishPurchaseDialog = ref(false);
const customForm = ref<InstanceType<typeof Form> | null>(null);
const customArgs = ref<{ customName: string; receiverName: string }>({ customName: '', receiverName: '' });
const filters = ref<((purchase: WishPurchaseWish) => boolean)[]>([]);
const purchaseListItems = ref<InstanceType<typeof ListItem>[]>([]);
const freeTextFilterIds = ref<string[] | null>(null);

const sortedPurchases = computed(() => {
    return Array.from(purchases.value || []).sort((a, b) => {
        return `${a.ReceiverName}${a.WishOwnerId}`.localeCompare(`${b.ReceiverName}${b.WishOwnerId}`);
    });
});

const filteredPurchases = computed(() => {
    return sortedPurchases.value.filter((p) => {
        if (!!freeTextFilterIds.value && !freeTextFilterIds.value.includes(p.Id)) {
            return false;
        }

        if (filterGiven.value && !!p.GivenDate) {
            return false;
        }

        if (filters.value.length > 0) {
            return filters.value.every((f) => f(p));
        }

        return true;
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

    showAddCustomWishPurchaseDialog.value = false;
};

watchEffect(() => {
    if (!import.meta.client) {
        return;
    }

    if (freeTextSearch.value.length < 3) {
        freeTextFilterIds.value = null;
        return;
    }

    const invariantSearch = freeTextSearch.value.toLowerCase();

    freeTextFilterIds.value = purchaseListItems.value
        .filter((item) => {
            const shouldShow = item.$el.innerText.toLowerCase().includes(invariantSearch);
            return shouldShow;
        })
        .map((item) => item.$el.getAttribute('data-key') || '');
});
</script>

<template>
    <div class="flex flex-col w-full">
        <Tabs v-model="selectedTab">
            <Tab name="checklist">
                <Localized tkey="Checklist" />
            </Tab>
            <Tab name="tags">
                <Localized tkey="GiftTag" />
            </Tab>
        </Tabs>

        <TabPanels v-model="selectedTab">
            <TabPanel name="checklist" class="pt-6">
                <div class="w-full flex items-center justify-between pb-4">
                    <div class="flex items-center gap-3">
                        <Input v-model="freeTextSearch" :label="i18n('Search')" />
                        <WishPurchaseListFilterButton v-model="filters" />
                    </div>
                    <div class="flex items-center gap-3">
                        <WishPurchaseListFilter v-model:filter-given="filterGiven" />
                    </div>
                </div>

                <ListItem clickable class="mb-4" @click="handleAddCustomPurchase">
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
                </ListItem>

                <TransitionGroup name="growDownSlow">
                    <NuxtLink
                        v-for="purchase in filteredPurchases"
                        v-ripple
                        :key="purchase.Id"
                        :to="`/my/checklist/${purchase.Id}`"
                    >
                        <ListItem ref="purchaseListItems" :data-key="purchase.Id" clickable class="mb-2 flex gap-3">
                            <div class="text-xs text-opacity-50 w-[75px]">
                                <div v-if="purchase.WishOwnerId" class="text-center flex flex-col gap-1 items-center">
                                    <User :user-id="purchase.WishOwnerId" without-username />
                                    <User :user-id="purchase.WishOwnerId" without-avatar class="opacity-60" />
                                </div>
                                <div v-else class="text-center flex flex-col gap-1 items-center">
                                    <EmojiAvatar color="rgb(37 99 235)"> 🙋 </EmojiAvatar>
                                    <div class="opacity-60">{{ purchase.ReceiverName }}</div>
                                </div>
                            </div>

                            <div class="flex flex-col flex-1 gap-1 text-sm">
                                <div class="line-clamp-2">
                                    {{ purchase.Name }}
                                </div>

                                <WishPurchaseProgress :wish-purchase="purchase" />

                                <div class="flex items-center gap-2">
                                    <WishPurchaseNoteManageButton :wish-purchase-id="purchase.Id" @click.stop.prevent />
                                    <WishPurchaseNoteBadges
                                        :wish-purchase-id="purchase.Id"
                                        class="flex gap-2 flex-wrap mt-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Button round flat>
                                    <Icon font-size="24px" name="navigate_next" />
                                </Button>
                            </div>
                        </ListItem>
                    </NuxtLink>
                </TransitionGroup>
            </TabPanel>
            <TabPanel name="tags">
                <WishPurchaseTagList :wish-purchases="sortedPurchases" class="pt-6" />
            </TabPanel>
        </TabPanels>

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
    </div>
</template>
