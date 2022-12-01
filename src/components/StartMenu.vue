<template>
    <div class="flex flex-wrap gap-4 items-center justify-center">
        <NuxtLink to="/my/groups" class="w-full max-w-[45%]">
            <Card class="flex flex-col text-center gap-4">
                <div class="text-6xl">👯</div>
                <div>My Groups</div>
            </Card>
        </NuxtLink>

        <NuxtLink to="/my/wishes" class="w-full max-w-[45%]">
            <Card class="flex flex-col text-center gap-4">
                <div class="text-6xl">📃</div>
                <div>My Wishes</div>
            </Card>
        </NuxtLink>

        <NuxtLink to="/my/profile" class="w-full max-w-[45%]">
            <Card class="flex flex-col text-center gap-4">
                <div class="text-6xl">👨‍🔧</div>
                <div>My Profile</div>
            </Card>
        </NuxtLink>
    </div>
</template>
