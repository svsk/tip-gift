<script setup lang="ts">
usePageTitle('My Groups');
</script>

<template>
    <Card class="flex flex-col gap-4">
        <div class="flex w-full justify-between items-center gap-4">
            <div class="flex justify-between items-center gap-2">
                <NuxtLink to="/">
                    <Button round>
                        <Icon font-size="24px" name="arrow_back" />
                    </Button>
                </NuxtLink>

                <h1 class="font-medium text-lg">My Groups</h1>
            </div>

            <GroupsAddGroupButton />
        </div>

        <div class="text-sm opacity-60">
            Join different groups with different sets of friends and family. Choose what wishes to share with which
            group.
        </div>

        <GroupsGroupList />
    </Card>
</template>
