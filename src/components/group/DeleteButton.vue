<script setup lang="ts">
import { type WishUserGroup } from '@prisma-app/client';

interface Props {
    group: WishUserGroup;
}

const props = defineProps<Props>();
const { i18n } = await useI18n();

const deletingGroup = ref<WishUserGroup | null>(null);

const handleDeleteGroup = async (group: WishUserGroup) => {
    deletingGroup.value = group;
};

const canDelete = computed(() => {
    return isGroupAdmin(props.group);
});

const handleDeleteConfirmed = async () => {
    if (!deletingGroup.value) return;

    await deleteGroup(deletingGroup.value);
    deletingGroup.value = null;
};
</script>

<template>
    <Button v-if="canDelete" round @click="handleDeleteGroup(group)">
        <Icon font-size="20px" name="delete" />
    </Button>

    <Dialog :model-value="!!deletingGroup">
        <template #title> <Localized tkey="DeleteGroup" />? </template>

        <div class="flex flex-col gap-4">
            {{ i18n('GroupDeleteConfirmation', deletingGroup!.GroupName) }}

            <div class="flex justify-end items-center gap-2">
                <Button @click="() => (deletingGroup = null)" flat>
                    <Localized tkey="Cancel" />
                </Button>
                <Button color="bg-red-500" @click="handleDeleteConfirmed">
                    <Localized tkey="Delete" />
                </Button>
            </div>
        </div>
    </Dialog>
</template>
