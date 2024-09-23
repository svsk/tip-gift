<script setup lang="ts">
import { type Wish } from '@prisma-app/client';
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
const busyAdding = ref(false);
const newWish = ref<Wish | null>(null);
const addToast = ref<InstanceType<typeof Toast>>();

watch(
    () => props.modelValue,
    (value) => {
        if (value === true) {
            newWish.value = {
                GroupId: crypto.randomUUID(),
                Order: -1,
            } as Wish;
        }

        adding.value = value;
    },
    { immediate: true }
);

watch(
    () => adding.value,
    (value) => {
        emit('update:modelValue', value);
    }
);

const handleSaveNewEntry = async () => {
    if (newWish.value) {
        busyAdding.value = true;
        try {
            await addWish(newWish.value);
            addToast.value?.show(6000);
            newWish.value = null;
            adding.value = false;
        } finally {
            busyAdding.value = false;
        }
    }
};
</script>

<template>
    <Dialog v-model="adding" persistent>
        <template #title>
            <Localized tkey="AddNewWish" />
        </template>

        <Form @submit="handleSaveNewEntry" class="flex flex-col gap-4">
            <WishInputFields v-if="newWish" v-model="newWish" />
            <div class="flex justify-end items-center gap-2">
                <Button :disable="busyAdding" @click="() => (adding = false)" flat>
                    <Localized tkey="Cancel" />
                </Button>
                <Button :disable="busyAdding" type="submit">
                    <Localized tkey="Confirm" />
                </Button>
            </div>
        </Form>
    </Dialog>

    <Toast ref="addToast" location="top">
        <div class="flex flex-row items-center no-wrap gap-4">
            <Icon name="check" font-size="32px" class-name="text-green-500" />
            <Localized tkey="WishAdded" />
        </div>
    </Toast>
</template>
