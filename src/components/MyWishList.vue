<script setup lang="ts">
import { type Wish } from '@prisma-app/client';
import { ref } from 'vue';
import draggable from 'vuedraggable';
import Toast from '~/components/Toast.vue';

const { data: wishes } = await useWishes();

const { i18n } = await useI18n();
const adding = ref(false);
const editing = ref(false);
const editWish = ref<Wish | null>(null);
const busyUpdating = ref(false);
const orderedWishes = computed(() => (wishes.value || []).sort((a, b) => a.Order - b.Order));
const reorderMode = ref(false);
const reordering = ref(false);
const sharing = ref(false);
const showDeleteConfirmation = ref(false);
const wishForDeletion = ref<Wish | null>(null);
const deleteToast = ref<InstanceType<typeof Toast>>();
const pullToRefreshEnabled = inject<Ref<boolean> | null>('pullToRefreshEnabled', null);

const handleDeleteEntryClicked = (entry: Wish) => {
    wishForDeletion.value = entry;
    showDeleteConfirmation.value = true;
};

const handleDeleteConfirmed = async () => {
    if (wishForDeletion.value) {
        await deleteWish(wishForDeletion.value);
        wishForDeletion.value = null;
    }

    showDeleteConfirmation.value = false;
    deleteToast.value?.show(6000);
};

const handleEditClicked = async (wish: Wish) => {
    editWish.value = { ...wish };
    editing.value = true;
};

const handleAddClicked = async () => {
    adding.value = true;
};

const handleUpdateEntry = async () => {
    if (editWish.value) {
        busyUpdating.value = true;
        try {
            await updateWishes([editWish.value]);
            editing.value = false;
        } finally {
            busyUpdating.value = false;
        }
    }
};

const handleShareClicked = () => {
    sharing.value = true;
};

const handleReorder = async (moveEvent: { moved: { newIndex: number; oldIndex: number } }) => {
    const { oldIndex, newIndex } = moveEvent.moved;
    if (wishes.value && oldIndex != null && oldIndex >= 0) {
        const movedWish = wishes.value.splice(oldIndex, 1).at(0);
        if (movedWish) {
            wishes.value.splice(newIndex, 0, movedWish);

            const reorderedItems = new Array<Wish>();
            wishes.value.forEach((w, idx) => {
                const newOrder = (idx + 1) * 100;
                if (newOrder != w.Order) {
                    w.Order = newOrder;
                    reorderedItems.push(w as Wish);
                }
            });

            reordering.value = true;
            try {
                await updateWishes(reorderedItems);
            } finally {
                reordering.value = false;
            }
        }
    }
};

watch(
    () => reorderMode.value,
    () => {
        if (!isRef(pullToRefreshEnabled)) {
            return;
        }

        if (reorderMode.value) {
            pullToRefreshEnabled.value = false;
        } else {
            pullToRefreshEnabled.value = true;
        }
    }
);

onBeforeUnmount(() => {
    if (isRef(pullToRefreshEnabled)) {
        pullToRefreshEnabled.value = true;
    }
});
</script>

<template>
    <div class="flex flex-col flex-nowrap relative">
        <div class="flex w-full justify-between items-center gap-4 mb-4">
            <div class="flex justify-between items-center gap-2">
                <NuxtLink to="/">
                    <Button round>
                        <Icon font-size="24px" name="arrow_back" />
                    </Button>
                </NuxtLink>

                <h1 class="font-medium text-lg">
                    <Localized tkey="MyWishes" />
                </h1>
            </div>

            <Button round flat @click="handleShareClicked" class="flex items-center justify-center">
                <Icon font-size="20px" name="share" />
            </Button>
        </div>

        <div class="flex justify-end pb-4 gap-2">
            <Button @click="reorderMode = !reorderMode">
                <Localized v-if="reorderMode" tkey="Finish" />
                <Localized v-else="reorderMode" tkey="Reorder" />
            </Button>
            <Button @click="handleAddClicked">
                <Localized tkey="AddNew" />
            </Button>
        </div>

        <EmptyState v-if="!wishes?.length"> <Localized tkey="NothingHereYet" />... </EmptyState>

        <draggable
            :list="orderedWishes"
            @change="handleReorder"
            animation="400"
            :disabled="!reorderMode"
            handle=".handle"
            item-key="Id"
        >
            <template #item="{ element: wish }">
                <ListItem class="mb-2">
                    <WishListItem class="flex-grow" :entry="wish" />

                    <div class="flex gap-1 items-center">
                        <Button v-show="!reorderMode" @click="() => handleEditClicked(wish)" round>
                            <Icon name="edit" font-size="20px" />
                        </Button>

                        <Button v-show="!reorderMode" @click="() => handleDeleteEntryClicked(wish)" round>
                            <Icon name="delete" font-size="20px" />
                        </Button>

                        <Button round v-show="reorderMode" class="handle cursor-move" :disable="reordering">
                            <Icon name="drag_indicator" font-size="20px" />
                        </Button>
                    </div>
                </ListItem>
            </template>
        </draggable>
    </div>

    <Toast ref="deleteToast" location="top">
        <div class="flex flex-row items-center no-wrap gap-4">
            <Icon name="check" font-size="32px" class-name="text-green-500" />
            <Localized tkey="WishDeleted" />
        </div>
    </Toast>

    <WishAddDialog v-model="adding" />

    <Dialog v-model="editing">
        <template #title>
            <Localized tkey="EditWish" />
        </template>

        <Form @submit="handleUpdateEntry" class="flex flex-col gap-4">
            <WishInputFields v-if="editWish" v-model="editWish" />
            <div class="flex justify-end items-center gap-2">
                <Button :disable="busyUpdating" @click="() => (editing = false)" flat>
                    <Localized tkey="Cancel" />
                </Button>
                <Button :disable="busyUpdating" type="submit">
                    <Localized tkey="Confirm" />
                </Button>
            </div>
        </Form>
    </Dialog>

    <Dialog v-model="sharing">
        <template #title><Localized tkey="ShareWishList" /></template>

        <div class="flex flex-col gap-4">
            <ShareDialog />

            <div class="flex justify-end items-center gap-2">
                <Button @click="() => (sharing = false)" flat>
                    <Localized tkey="Close" />
                </Button>
            </div>
        </div>
    </Dialog>

    <Dialog v-model="showDeleteConfirmation">
        <template #title> <Localized tkey="DeleteWish" />? </template>

        <div class="flex flex-col gap-4">
            {{ i18n('DeleteConfirmation', wishForDeletion?.Name ? `"${wishForDeletion.Name}"` : 'this wish') }}

            <div class="flex justify-end items-center gap-2">
                <Button @click="() => (showDeleteConfirmation = false)" flat>
                    <Localized tkey="Cancel" />
                </Button>
                <Button color="bg-red-500" @click="handleDeleteConfirmed">
                    <Localized tkey="Delete" />
                </Button>
            </div>
        </div>
    </Dialog>
</template>
