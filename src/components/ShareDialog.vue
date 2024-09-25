<script setup lang="ts">
import Input from './Input.vue';

const listName = ref('');
const nameInput = ref<InstanceType<typeof Input> | null>();

const { data: shares } = await useShares();
const baseUrl = () => (process.client ? window.location.origin : '');

const listUrl = computed(() => {
    if (shares.value instanceof Array && shares.value.length > 0) {
        const shareData = shares.value.at(0);
        listName.value = shares.value.at(0)?.Name || '';
        return `${baseUrl()}/wishes/${shareData?.UniqueKey}/${shareData?.Slug}`;
    }

    return null;
});

const linkExists = computed(() => !!listUrl.value);
const generating = ref(false);

onMounted(() => {
    nameInput.value?.focus();
});

const handleGenerateClicked = async () => {
    if (!listName.value) {
        return;
    }

    generating.value = true;
    try {
        const shareData = await generateShareKey(listName.value);
        if (shareData) {
            refreshShares();
        }
    } finally {
        generating.value = false;
    }
};
</script>

<template>
    <div class="flex gap-4 items-center flex-col w-full">
        <div class="w-full flex gap-4">
            <Input
                :readonly="linkExists"
                ref="nameInput"
                :label="i18n('ListName')"
                v-model="listName"
                class="flex-grow w-full"
            />

            <Transition name="slideIn">
                <Button
                    v-if="!linkExists"
                    @click="handleGenerateClicked"
                    :disable="linkExists || generating"
                    class="w-[160px]"
                >
                    <Localized tkey="CreateLink" />
                </Button>
            </Transition>
        </div>

        <Transition name="slideDown">
            <div class="w-full flex gap-3" v-if="linkExists">
                <Input :label="i18n('Link')" readonly :model-value="listUrl" class="flex-grow w-full" />
                <CopyToClipboardButton :text="listUrl" />
            </div>
        </Transition>
    </div>
</template>
