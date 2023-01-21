<script setup lang="ts">
const auth = useAuth();
const loggedIn = !!auth.value?.id;
</script>

<template>
    <nav v-if="loggedIn" class="flex justify-between flex-grow">
        <ul class="flex gap-5"></ul>

        <ul>
            <li>
                <NuxtLink to="/my/profile">
                    <User
                        v-if="auth"
                        class="flex gap-1 items-center flex-row-reverse font-medium text-sm"
                        :user-id="auth.id"
                        avatar-class="scale-75"
                    />
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>
