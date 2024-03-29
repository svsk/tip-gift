<script setup lang="ts">
import Input from './Input.vue';

const listName = ref('');
const nameInput = ref<InstanceType<typeof Input> | null>();
const copied = ref(false);
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

watch(copied, () => {
    if (copied.value) {
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    }
});

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

const handleCopyClicked = async () => {
    if (listUrl.value) {
        await navigator.clipboard.writeText(listUrl.value);
        copied.value = true;
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
                <Button
                    :disable="!linkExists"
                    @click="handleCopyClicked"
                    round
                    class="flex items-center justify-center w-[50px]"
                >
                    <Transition name="slideDown">
                        <Icon class="absolute" v-if="copied" font-size="24px" name="check" />
                    </Transition>
                    <Transition name="slideUp">
                        <Icon class="absolute" v-if="!copied" font-size="24px" name="content_copy" />
                    </Transition>
                </Button>
            </div>
        </Transition>
    </div>
</template>
