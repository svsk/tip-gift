<script setup lang="ts">
const termKey = 'MyProfile';
const { i18n } = await useI18n();
const title = computed(() => i18n(termKey));
watch(title, (newTitle) => usePageTitle(newTitle), { immediate: true });

const userId = useAuth().value?.id || '';
const user = useUser(userId);

const handleNameChanged = (newName: string) => {
    if (user.value) {
        user.value.Name = newName;
        updateUser(user.value);
    }
};

const handleLanguageChanged = async (newLanguage: string) => {
    if (user.value) {
        user.value.PreferredLanguage = newLanguage;
        await updateUser(user.value);
        window.location.reload();
    }
};

let debouncedUpdate: NodeJS.Timeout | undefined = undefined;
const handleColorChanged = (newColour: string | null | undefined) => {
    if (user.value && newColour) {
        user.value.AvatarColour = newColour;
        clearTimeout(debouncedUpdate);
        debouncedUpdate = setTimeout(() => {
            if (user.value) {
                updateUser(user.value);
            }
        }, 600);
    }
};

const handleEmojiClicked = (emoji: string | null) => {
    if (user.value) {
        user.value.AvatarEmoji = emoji;
        updateUser(user.value);
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

            <h1 class="font-medium text-lg">
                <Localized tkey="Profile" />
            </h1>
        </div>

        <div class="h-[1px] bg-slate-600 w-full mb-3" />

        <div class="flex gap-6 items-center">
            <div class="flex">
                <EmojiAvatar :user="user" class="cursor-pointer" />
            </div>
            <Input
                :debounce="600"
                class="flex-grow"
                :label="i18n('DisplayName')"
                :model-value="user?.Name"
                @update:model-value="handleNameChanged"
            />
        </div>

        <div>
            <LanguagePicker :model-value="user.PreferredLanguage" @update:model-value="handleLanguageChanged" />
        </div>

        <div class="flex gap-6 justify-between">
            <div class="flex gap-2">
                <ColorPicker v-if="user" :model-value="user.AvatarColour" @update:modelValue="handleColorChanged" />
                <EmojiPicker v-if="user" :model-value="user.AvatarEmoji" @update:modelValue="handleEmojiClicked" />
            </div>

            <div>
                <Button flat @click="handleLogOut">
                    <Localized tkey="LogOut" />
                </Button>
            </div>
        </div>
    </Card>
</template>
