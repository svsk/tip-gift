<script setup lang="ts">
import { Wish } from '@prisma/client';
import { ref } from 'vue';
import draggable from 'vuedraggable';

const { data: wishes } = await useWishes();

const adding = ref(false);
const newWish = ref<Wish | null>(null);
const editing = ref(false);
const editWish = ref<Wish | null>(null);
const busyAdding = ref(false);
const orderedWishes = computed(() => (wishes.value || []).sort((a, b) => a.Order - b.Order));
const reorderMode = ref(false);
const reordering = ref(false);
const sharing = ref(false);
const showDeleteConfirmation = ref(false);
const wishForDeletion = ref<Wish | null>(null);

const handleAddClicked = async () => {
    newWish.value = {
        GroupId: crypto.randomUUID(),
        Order: -1,
    } as Wish;
    adding.value = true;
};

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
};

const handleSaveNewEntry = async () => {
    if (newWish.value) {
        busyAdding.value = true;
        try {
            await addWish(newWish.value);
            newWish.value = null;
            adding.value = false;
        } finally {
            busyAdding.value = false;
        }
    }
};

const handleEditClicked = async (wish: Wish) => {
    editWish.value = { ...wish };
    editing.value = true;
};

const handleUpdateEntry = async () => {
    if (editWish.value) {
        busyAdding.value = true;
        try {
            await updateWishes([editWish.value]);
            editing.value = false;
        } finally {
            busyAdding.value = false;
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
                    reorderedItems.push(w);
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
</script>

<template>
    <div class="flex flex-col flex-nowrap relative">
        <div class="flex justify-end pb-4 gap-2">
            <Button @click="handleShareClicked" class="flex items-center justify-center">
                <Icon name="share" />
            </Button>
            <Button @click="reorderMode = !reorderMode">{{ reorderMode ? 'Finish' : 'Reorder' }}</Button>
            <Button @click="handleAddClicked">Add New</Button>
        </div>

        <EmptyState v-if="!wishes?.length"> Nothing here yet... </EmptyState>

        <draggable
            :list="orderedWishes"
            @change="handleReorder"
            animation="400"
            :disabled="!reorderMode"
            handle=".handle"
            item-key="Id"
        >
            <template #item="{ element: wish }">
                <div class="flex items-center border-b border-slate-600 bg-gray-800 gap-1 last:border-b-0">
                    <WishListItem class="py-3 flex-grow" :entry="wish" />

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
                </div>
            </template>
        </draggable>
    </div>

    <Dialog v-model="adding">
        <template #title>Add New Wish</template>

        <Form @submit="handleSaveNewEntry" class="flex flex-col gap-4">
            <WishInputFields v-if="newWish" v-model="newWish" />
            <div class="flex justify-end items-center gap-2">
                <Button :disable="busyAdding" @click="() => (adding = false)" flat>Cancel</Button>
                <Button :disable="busyAdding" type="submit">Confirm</Button>
            </div>
        </Form>
    </Dialog>

    <Dialog v-model="editing">
        <template #title>Editing Wish</template>

        <Form @submit="handleUpdateEntry" class="flex flex-col gap-4">
            <WishInputFields v-if="editWish" v-model="editWish" />
            <div class="flex justify-end items-center gap-2">
                <Button :disable="busyAdding" @click="() => (editing = false)" flat>Cancel</Button>
                <Button :disable="busyAdding" type="submit">Save</Button>
            </div>
        </Form>
    </Dialog>

    <Dialog v-model="sharing">
        <template #title>Share Wish List</template>

        <div class="flex flex-col gap-4">
            <ShareDialog />

            <div class="flex justify-end items-center gap-2">
                <Button @click="() => (sharing = false)" flat>Close</Button>
            </div>
        </div>
    </Dialog>

    <Dialog v-model="showDeleteConfirmation">
        <template #title>Delete Wish?</template>

        <div class="flex flex-col gap-4">
            Are you sure you want to delete {{ wishForDeletion?.Name ? `"${wishForDeletion.Name}"` : 'this wish' }} from
            the list?

            <div class="flex justify-end items-center gap-2">
                <Button @click="() => (showDeleteConfirmation = false)" flat>Cancel</Button>
                <Button color="bg-red-500" @click="handleDeleteConfirmed">Delete</Button>
            </div>
        </div>
    </Dialog>
</template>
