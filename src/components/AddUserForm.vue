<script setup lang="ts">
interface Props {
    groupId: string;
}

const props = defineProps<Props>();

const { data: groups } = await useGroups();

const generatingCode = ref(false);

const group = computed(() => {
    return groups.value?.find((g) => g.Id === props.groupId);
});

const inviteCode = computed(() => {
    return group.value?.InviteCode;
});

const inviteUrl = computed(() => {
    return `${window.location.origin}/group/join/${inviteCode.value}`;
});

const emit = defineEmits(['confirm', 'cancel']);

const handleGenerateCodeClicked = async () => {
    try {
        generatingCode.value = true;
        await createGroupInviteCode(props.groupId);
    } finally {
        generatingCode.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-6 flex-nowrap">
        <div class="flex flex-nowrap items-center gap-2">
            <Input :model-value="inviteCode" readonly :label="i18n('InviteCode')" class="flex-grow" />
            <CopyToClipboardButton v-if="inviteCode" :text="inviteUrl" />
        </div>

        <Button v-if="!inviteCode" :disable="generatingCode" @click="handleGenerateCodeClicked">
            <Localized tkey="CreateInviteCode" />
        </Button>

        <Localized v-if="inviteCode" tkey="InviteExplanation" />
    </div>
</template>
