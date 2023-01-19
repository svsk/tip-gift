<script setup lang="ts">
import data from '@emoji-mart/data';
import { Picker as EmojiPicker } from 'emoji-mart';

usePageTitle('My Profile');
const userId = useAuth().value?.id || '';
const { data: user } = await useUser(userId);

const colorPicker = ref<any>(null);
const emojiPickerContainer = ref<any>(null);

onMounted(() => {
    const emojiPicker = new EmojiPicker({
        data,
        theme: 'dark',
        onEmojiSelect: handleEmojiClicked,
    });

    emojiPickerContainer.value.appendChild(emojiPicker);
});

const handleNameChanged = (newName: string) => {
    if (user.value) {
        user.value.Name = newName;
        updateUser(user.value);
    }
};

const handleChangeColor = () => {
    colorPicker.value?.click();
};

const handleChangeEmoji = () => {
    showEmojiPicker.value = !showEmojiPicker.value;
};

let debouncedUpdate: NodeJS.Timeout | undefined = undefined;
const handleColorChanged = (newColour: string) => {
    if (user.value) {
        user.value.AvatarColour = newColour;
        clearTimeout(debouncedUpdate);
        debouncedUpdate = setTimeout(() => {
            if (user.value) {
                updateUser(user.value);
            }
        }, 600);
    }
};

const showEmojiPicker = ref(false);

const handleEmojiClicked = (e: any) => {
    if (user.value) {
        user.value.AvatarEmoji = e.native;
        updateUser(user.value);
        showEmojiPicker.value = false;
    }
};
</script>

<template>
    <Card class="flex flex-col gap-4 pb-12" v-if="user">
        <div>
            <h1 class="font-medium text-lg">Profile</h1>
        </div>

        <div class="flex gap-6">
            <div>
                <EmojiAvatar :user="user" class="cursor-pointer" />
                <input
                    v-if="user"
                    ref="colorPicker"
                    type="color"
                    :value="user.AvatarColour"
                    @input="(e: any) => handleColorChanged(e.target.value)"
                    class="opacity-0 h-0 w-0"
                />
            </div>
            <Input
                :debounce="600"
                class="flex-grow"
                label="Display Name"
                :model-value="user?.Name"
                @update:model-value="handleNameChanged"
            />
        </div>
        <div class="flex gap-6">
            <Button @click="handleChangeColor" round style="height: 45px; width: 45px">
                <Icon font-size="24px" name="palette" />
            </Button>

            <Button @click="handleChangeEmoji" round style="height: 45px; width: 45px">
                <Icon font-size="24px" name="mood" />
            </Button>

            <Transition name="slideDown">
                <div v-show="showEmojiPicker" class="fixed z-10">
                    <div ref="emojiPickerContainer"></div>
                </div>
            </Transition>
        </div>
    </Card>
</template>
