<script setup lang="ts">
import Input from '../Input.vue';

interface Props {
    groupId: string;
}

const props = defineProps<Props>();

const { data: groups } = await useGroups();
const { i18n } = await useI18n();
const groupShares = await useGroupShares(props.groupId);

const listName = computed(() => groups.value.find((g) => g.Id === props.groupId)?.GroupName);
const busy = ref(false);
const showDialog = ref(false);

const baseUrl = () => (import.meta.client ? window.location.origin : '');

const listUrl = computed(() => {
    const shares = groupShares.data;
    if (shares.value instanceof Array && shares.value.length > 0) {
        const shareData = shares.value.at(0);
        return `${baseUrl()}/wishes/${shareData?.UniqueKey}/${shareData?.Slug}`;
    }

    return null;
});

const handleGenerateClicked = async () => {
    if (!listName.value) {
        return;
    }

    busy.value = true;
    try {
        await generateGroupShare(props.groupId, listName.value);
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <div>
        <Button round flat icon="share" @click="showDialog = true" />

        <Dialog v-model="showDialog">
            <template #title>
                <Localized tkey="Share" />
            </template>

            <div class="flex flex-col gap-3">
                <Input :label="i18n('ListName')" readonly :model-value="listName" />

                <div v-if="listUrl" class="flex gap-2">
                    <Input :label="i18n('Link')" readonly :model-value="listUrl" />
                    <CopyToClipboardButton :text="listUrl" />
                </div>

                <Button v-else :disable="busy" @click="handleGenerateClicked">
                    <Localized tkey="ShareWishList" />
                </Button>

                <div class="pt-3 flex items-center justify-end">
                    <Button flat @click="showDialog = false">
                        <Localized tkey="Close" />
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
