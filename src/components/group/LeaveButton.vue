<script setup lang="ts">
interface Props {
    groupId: string;
}

const props = defineProps<Props>();

const { i18n } = await useI18n();

const showConfirmation = ref(false);
const busy = ref(false);

const handleConfirmation = async () => {
    try {
        busy.value = true;
        await leaveGroup(props.groupId);
        navigateTo('/');
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <div>
        <Button round flat @click="showConfirmation = true">
            <Icon name="exit_to_app" font-size="24px" />
        </Button>

        <Dialog
            v-model="showConfirmation"
            with-confirm
            confirm-color="bg-red-500"
            :confirm-text="i18n('LeaveGroup')"
            :disable-confirm="busy"
            :disable-cancel="busy"
            @cancel="showConfirmation = false"
            @confirm="handleConfirmation"
        >
            <template #title> <Localized tkey="LeaveGroup" />? </template>

            <Localized tkey="LeaveGroupConfirmation" />
        </Dialog>
    </div>
</template>
