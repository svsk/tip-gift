<template>
    <Card class="flex flex-col gap-4">
        <div class="flex w-full justify-between items-center gap-4">
            <div class="flex justify-between items-center gap-2">
                <h1 class="font-medium text-lg">
                    <Localized tkey="MyWishLists" />
                </h1>
            </div>
        </div>

        <div class="flex flex-col gap-6">
            <NuxtLink to="/my/wishes" class="flex items-center gap-2">
                <EmojiAvatar :color="'#2563eb'"> 🎁 </EmojiAvatar>

                <div>
                    <div>
                        <Localized tkey="MyWishes" />
                    </div>
                    <div class="text-xs opacity-60">
                        <Localized tkey="AddYourWishesHere" />
                    </div>
                </div>
            </NuxtLink>

            <NuxtLink to="/my/checklist" class="flex items-center gap-2">
                <EmojiAvatar :color="'#2563eb'"> 📃 </EmojiAvatar>

                <div>
                    <div>
                        <Localized tkey="MyChecklist" />
                    </div>
                    <div class="text-xs opacity-60">
                        <Localized tkey="ItemsYouveReserved" />
                    </div>
                </div>
            </NuxtLink>
        </div>

        <hr class="opacity-25" />

        <div class="flex items-center justify-between gap-4">
            <div class="text-sm opacity-60">
                <Localized tkey="GroupHelpText" />
            </div>
        </div>

        <GroupList allow-adding />
    </Card>
</template>
