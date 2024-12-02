<script setup lang="ts">
import { type Wish } from '@prisma-app/client';

interface Props {
    item: Wish;
    groupId: string;
}

const loading = ref(false);

const emit = defineEmits(['close']);

const props = defineProps<Props>();

const handleSubmit = async () => {
    loading.value = true;
    await giveGift(props.groupId, props.item.Id);
    emit('close');
    loading.value = false;
};

const handleCancel = () => {
    emit('close');
};
</script>

<template>
    <Form @submit="handleSubmit" class="flex flex-col gap-2">
        <Localized tkey="BoughtItemExplanation" />

        <!-- <div>List people here</div> -->

        <div class="flex justify-end gap-2 flex-nowrap pt-2">
            <Button :disable="loading" flat @click="handleCancel">
                <Localized tkey="Cancel" />
            </Button>
            <Button :disable="loading" type="submit">
                <Localized tkey="Confirm" />
            </Button>
        </div>
    </Form>
</template>
