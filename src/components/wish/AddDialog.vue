<script setup lang="ts">
import { type Wish, type WishUserGroup } from '@prisma-app/client';
import Toast from '~/components/Toast.vue';

interface Props {
    modelValue: boolean;
}

interface Emits {
    (event: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const adding = ref(false);
const busy = ref(false);
const newWish = ref<Wish | null>(null);
const addToast = ref<InstanceType<typeof Toast>>();
const step = ref(1);
const addedWishId = ref<string | null>(null);

const initializeDialog = () => {
    newWish.value = {
        GroupId: crypto.randomUUID(),
        Order: -1,
    } as Wish;

    step.value = 1;
};

watch(
    () => props.modelValue,
    () => {
        if (props.modelValue && !adding.value) {
            initializeDialog();
        }

        adding.value = props.modelValue;
    },
    { immediate: true }
);

watch(
    () => adding.value,
    (value) => emit('update:modelValue', value)
);

const handleSaveNewEntry = async () => {
    if (newWish.value) {
        busy.value = true;
        try {
            addedWishId.value = (await addWish(newWish.value))?.Id || null;
            step.value = 2;
        } finally {
            busy.value = false;
        }
    }
};

const excludedGroups = ref<string[]>([]);
const handleToggleGroup = (group: WishUserGroup) => {
    if (group.Id) {
        if (excludedGroups.value.includes(group.Id)) {
            excludedGroups.value = excludedGroups.value.filter((id) => id !== group.Id);
        } else {
            excludedGroups.value = [...excludedGroups.value, group.Id];
        }
    }
};

const handleShareConfirmed = async () => {
    if (!addedWishId.value) {
        return;
    }

    busy.value = true;
    try {
        await addWishToAllGroups(addedWishId.value, excludedGroups.value);
        adding.value = false;
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <Dialog v-model="adding" persistent>
        <template #title>
            <Localized v-if="step === 1" tkey="AddNewWish" />
            <Localized v-if="step === 2" tkey="ShareNewWish" />
        </template>

        <TransitionGroup name="slidePast">
            <Form v-if="step === 1" key="step1" @submit="handleSaveNewEntry" class="flex flex-col gap-4">
                <WishInputFields v-if="newWish" v-model="newWish" />
                <div class="flex justify-end items-center gap-2">
                    <Button :disable="busy" @click="() => (adding = false)" flat>
                        <Localized tkey="Cancel" />
                    </Button>
                    <Button :disable="busy" type="submit">
                        <Localized tkey="Confirm" />
                    </Button>
                </div>
            </Form>

            <Form v-if="step === 2" key="step2" @submit="handleShareConfirmed" class="flex flex-col gap-4">
                <Localized tkey="WishAdded" />

                <GroupList disable-navigation @group-clicked="handleToggleGroup">
                    <template #actions="{ group }">
                        <Checkbox :model-value="!excludedGroups.includes(group.Id)" />
                    </template>
                </GroupList>

                <div class="flex justify-end items-center gap-2">
                    <Button :disable="busy" @click="() => (adding = false)" flat>
                        <Localized tkey="Later" />
                    </Button>
                    <Button :disable="busy" type="submit">
                        <Localized tkey="Share" />
                    </Button>
                </div>
            </Form>
        </TransitionGroup>
    </Dialog>

    <Toast ref="addToast" location="top">
        <div class="flex flex-row items-center no-wrap gap-4">
            <Icon name="check" font-size="32px" class-name="text-green-500" />
            <Localized tkey="WishAdded" />
        </div>
    </Toast>
</template>
