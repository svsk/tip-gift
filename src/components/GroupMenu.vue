<template>
    <Card class="flex flex-col gap-4">
        <div class="flex w-full justify-between items-center gap-4">
            <div class="flex justify-between items-center gap-2">
                <h1 class="font-medium text-lg">My Wish Lists</h1>
            </div>
            <GroupsAddGroupButton />
        </div>

        <NuxtLink to="/my/wishes" class="flex items-center gap-2">
            <EmojiAvatar :color="'#2563eb'"> 📃 </EmojiAvatar>

            <div>
                <div>My Wishes</div>
                <div class="text-xs opacity-60">
                    <span>Owned by you</span>
                </div>
            </div>
        </NuxtLink>

        <hr class="opacity-25" />

        <div class="flex items-center justify-between gap-4">
            <div class="text-sm opacity-60">
                Join different groups with different sets of friends and family. Choose what wishes to share with which
                group.
            </div>
        </div>

        <GroupsGroupList />
    </Card>
</template>
