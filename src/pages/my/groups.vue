<script setup lang="ts">
usePageTitle('My Groups');
</script>

<template>
    <Card class="flex flex-col gap-4">
        <div class="flex w-full justify-between items-center gap-4">
            <div>
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
