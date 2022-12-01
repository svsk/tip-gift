<script setup lang="ts">
const linkActiveClass = `
	text-blue-500
	border-blue-500
	border-b-2
`;

const auth = useAuth();
const loggedIn = !!auth.value?.id;

const handleLogOut = async () => {
    await logout();
    window.location.reload();
};
</script>

<template>
    <nav v-if="loggedIn" class="flex justify-between flex-grow">
        <ul class="flex gap-5">
            <!-- <li>
                <NuxtLink class="p-4" :active-class="linkActiveClass" to="/">Home</NuxtLink>
            </li>
            <li>
                <NuxtLink class="p-4" :active-class="linkActiveClass" to="/about">About</NuxtLink>
            </li> -->
        </ul>

        <ul>
            <li>
                <button @click="handleLogOut">Log out</button>
            </li>
        </ul>
    </nav>
</template>
