<script setup lang="ts">
if (import.meta.client) {
    await import('emoji-picker-element');
}

interface Props {
    modelValue: string | null | undefined;
}

interface Emits {
    (event: 'update:modelValue', value: string | null): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showEmojiPicker = ref(false);

const handleChangeEmoji = () => {
    showEmojiPicker.value = !showEmojiPicker.value;
};

const handleEmojiClicked = (ev: { detail: { unicode: string } }) => {
    showEmojiPicker.value = false;
    emit('update:modelValue', ev.detail.unicode);
};
</script>

<template>
    <div class="relative">
        <Button round style="height: 45px; width: 45px" @click="handleChangeEmoji">
            <Icon font-size="24px" name="mood" />
        </Button>

        <ClientOnly>
            <Transition name="slideUp">
                <div v-show="showEmojiPicker" class="fixed mt-2">
                    <emoji-picker class="dark" @emoji-click="handleEmojiClicked" />
                </div>
            </Transition>
        </ClientOnly>
    </div>
</template>

<style scoped lang="scss">
emoji-picker {
    --border-radius: 8px;
}
</style>
