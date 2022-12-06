<script setup lang="ts">
import Input from './Input.vue';

const listName = ref('');
const nameInput = ref<InstanceType<typeof Input> | null>();
const copied = ref(false);
const listUrl = ref('');
const linkExists = ref(false);
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
            listUrl.value = window.location.origin + `/wishes/${shareData?.UniqueKey}/${shareData?.Slug}`;
            linkExists.value = true;
        }
    } finally {
        generating.value = false;
    }
};

const handleCopyClicked = async () => {
    await navigator.clipboard.writeText(listUrl.value);
    copied.value = true;
};
</script>

<template>
    <div class="flex gap-4 items-center flex-col w-full">
        <div class="w-full flex gap-4">
            <Input
                :readonly="linkExists"
                ref="nameInput"
                label="List Name"
                v-model="listName"
                class="flex-grow w-full"
            />
            <Button @click="handleGenerateClicked" :disable="linkExists || generating" class="w-[160px]"
                >Create Link</Button
            >
        </div>

        <div class="w-full flex gap-3">
            <Input label="Link" readonly v-model="listUrl" class="flex-grow w-full" />
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
    </div>
</template>

<style lang="scss" scoped>
.slideDown-enter-active,
.slideDown-leave-active {
    transition: all 0.1s linear;
}

.slideDown-enter-from,
.slideDown-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.slideUp-enter-active,
.slideUp-leave-active {
    transition: all 0.1s linear;
}

.slideUp-enter-from,
.slideUp-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>
