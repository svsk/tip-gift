<script setup lang="ts">
const linkActiveClass = `
	text-blue-500
	border-blue-500
	border-b-2
`;

const loggedIn = useAuth();
</script>

<template>
    <nav v-if="loggedIn?.isAuthenticated">
        <ul class="flex gap-5">
            <li>
                <NuxtLink class="p-4" :active-class="linkActiveClass" to="/">Home</NuxtLink>
            </li>
            <li>
                <NuxtLink class="p-4" :active-class="linkActiveClass" to="/about">About</NuxtLink>
            </li>
        </ul>
    </nav>
</template>
