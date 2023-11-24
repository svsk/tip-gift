<script setup lang="ts">
import data from '@emoji-mart/data';
import { Picker as JsEmojiPicker } from 'emoji-mart';

interface Props {
    modelValue: string | null;
}

interface Emits {
    (event: 'update:modelValue', value: string | null): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const emojiPickerContainer = ref<any>(null);
const showEmojiPicker = ref(false);
let appendTry: any = null;

onMounted(() => {
    const emojiPicker = new JsEmojiPicker({
        data,
        theme: 'dark',
        onEmojiSelect: (e: { native: string }) => {
            console.log(e);
            emit('update:modelValue', e.native);
            showEmojiPicker.value = false;
        },
    });

    appendTry = setInterval(() => {
        if (emojiPickerContainer.value?.appendChild) {
            emojiPickerContainer.value.appendChild(emojiPicker);
            clearInterval(appendTry);
        }
    }, 500);
});

const handleChangeEmoji = () => {
    showEmojiPicker.value = !showEmojiPicker.value;
};

onBeforeUnmount(() => {
    clearInterval(appendTry);
});
</script>

<template>
    <Button @click="handleChangeEmoji" round style="height: 45px; width: 45px">
        <Icon font-size="24px" name="mood" />
    </Button>

    <Transition name="slideDown">
        <div v-show="showEmojiPicker" class="fixed z-10">
            <div ref="emojiPickerContainer"></div>
        </div>
    </Transition>
</template>
