<script setup lang="ts">
import data from '@emoji-mart/data';
import { Picker as EmojiPicker } from 'emoji-mart';

usePageTitle('My Profile');
const userId = useAuth().value?.id || '';
const { data: user } = useUser(userId);

const colorPicker = ref<any>(null);
const emojiPickerContainer = ref<any>(null);
let appendTry: any = null;

onMounted(() => {
    const emojiPicker = new EmojiPicker({
        data,
        theme: 'dark',
        onEmojiSelect: handleEmojiClicked,
    });

    appendTry = setInterval(() => {
        if (emojiPickerContainer.value?.appendChild) {
            emojiPickerContainer.value.appendChild(emojiPicker);
            clearInterval(appendTry);
        }
    }, 500);
});

onBeforeUnmount(() => {
    clearInterval(appendTry);
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

const handleLogOut = async () => {
    await logout();
    window.location.reload();
};
</script>

<template>
    <Card class="flex flex-col gap-4 pb-8" v-if="user">
        <div class="flex items-center gap-2">
            <NuxtLink to="/">
                <Button round>
                    <Icon font-size="24px" name="arrow_back" />
                </Button>
            </NuxtLink>

            <h1 class="font-medium text-lg">Profile</h1>
        </div>

        <div class="h-[1px] bg-slate-600 w-full mb-3" />

        <div class="flex gap-6 items-center">
            <div class="flex">
                <EmojiAvatar :user="user" class="cursor-pointer" />
            </div>
            <Input
                :debounce="600"
                class="flex-grow"
                label="Display Name"
                :model-value="user?.Name"
                @update:model-value="handleNameChanged"
            />
        </div>
        <div class="flex gap-6 justify-between">
            <div class="flex gap-2">
                <Button @click="handleChangeColor" round style="height: 45px; width: 45px">
                    <Icon font-size="24px" name="palette" />
                </Button>
                <input
                    v-if="user"
                    ref="colorPicker"
                    type="color"
                    :value="user.AvatarColour"
                    @input="(e: any) => handleColorChanged(e.target.value)"
                    class="fixed h-0 w-0 border-none border-b-0 bg-none opacity-0 bg-transparent"
                />

                <Button @click="handleChangeEmoji" round style="height: 45px; width: 45px">
                    <Icon font-size="24px" name="mood" />
                </Button>

                <Transition name="slideDown">
                    <div v-show="showEmojiPicker" class="fixed z-10">
                        <div ref="emojiPickerContainer"></div>
                    </div>
                </Transition>
            </div>

            <div>
                <Button flat @click="handleLogOut">Log out</Button>
            </div>
        </div>
    </Card>
</template>
