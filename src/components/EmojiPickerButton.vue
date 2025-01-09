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

const handleEmojiClicked = (ev: { detail: { unicode: string } }) => {
    showEmojiPicker.value = false;
    emit('update:modelValue', ev.detail.unicode);
};
</script>

<template>
    <Button round class="relative" style="height: 45px; width: 45px">
        <slot>
            <Icon font-size="24px" name="mood" />
        </slot>

        <Menu v-model="showEmojiPicker" transition="slideUp" class="fixed mt-2">
            <ClientOnly>
                <emoji-picker class="dark" @emoji-click="handleEmojiClicked" />
            </ClientOnly>
        </Menu>
    </Button>
</template>

<style scoped lang="scss">
emoji-picker {
    --border-radius: 8px;
}
</style>
