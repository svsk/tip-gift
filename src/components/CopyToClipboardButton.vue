<script setup lang="ts">
interface Props {
    text?: string | null;
}

const props = defineProps<Props>();

const copied = ref(false);

const textExists = computed(() => !!props.text);

const handleCopyClicked = async () => {
    if (props.text) {
        await navigator.clipboard.writeText(props.text);
        copied.value = true;
    }
};

watch(copied, () => {
    if (copied.value) {
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    }
});
</script>

<template>
    <Button
        :disable="!textExists"
        @click="handleCopyClicked"
        round
        class="flex items-center justify-center w-[50px] h-[50px]"
    >
        <Transition name="slideUp">
            <Icon class="absolute" v-if="!copied" font-size="24px" name="content_copy" />
        </Transition>
        <Transition name="slideDown">
            <Icon class="absolute" v-if="copied" font-size="24px" name="check" />
        </Transition>
    </Button>
</template>
