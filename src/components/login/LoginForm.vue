<script setup lang="ts">
const { data: users } = useFetch('/api/users/getall');

const loggingIn = ref(false);

const handleLoginClicked = async (email: string) => {
    loggingIn.value = true;

    const { data: loginResult, error } = await useFetch('/api/users/login', {
        key: crypto.randomUUID(),
        method: 'POST',
        body: {
            username: email,
        },
    });

    if (!error.value && loginResult.value) {
        const auth = useAuth();
        auth.value = { isAuthenticated: true, username: email, userId: loginResult.value.Id };
        useRouter().push('/');
    }
};
</script>

<template>
    <h1 class="mb-2 text-2xl">Log In</h1>
    <div class="rounded bg-gray-800 p-6">
        <ul>
            <li class="flex items-center justify-between" v-for="user in users" :key="user.Id">
                <div>{{ user.Name }}</div>
                <div>
                    <button
                        @click="() => handleLoginClicked(user.Email)"
                        :disabled="loggingIn"
                        class="rounded px-4 py-1 bg-blue-600"
                        type="button"
                    >
                        Log In
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>
