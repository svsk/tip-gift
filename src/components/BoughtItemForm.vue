<script setup lang="ts">
import { Wish } from '@prisma/client';
import { giveGift } from '~~/composables/useGroups';

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
    refreshGivenGifts(props.groupId);
    emit('close');
    loading.value = false;
};

const handleCancel = () => {
    emit('close');
};
</script>

<template>
    <Form @submit="handleSubmit" class="flex flex-col gap-2">
        Are you sure you want to notify the group that you're giving this gift? The receiver will obviously not be
        notified.

        <!-- <div>List people here</div> -->

        <div class="flex justify-end gap-2 flex-nowrap">
            <Button :disable="loading" flat @click="handleCancel">Cancel</Button>
            <Button :disable="loading" type="submit">Confirm</Button>
        </div>
    </Form>
</template>
