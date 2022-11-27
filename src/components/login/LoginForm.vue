<script setup lang="ts">
const supabase = useSupabaseClient();

const email = ref('');
const loading = ref(false);
const successfulSignin = ref(false);

const handleLogin = async () => {
    loading.value = true;

    try {
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
        });

        if (error) throw error;
        successfulSignin.value = true;
    } catch (error: any) {
        alert(error.error_description || error.message);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <h1 class="mb-2 text-2xl">Log In</h1>
    <div class="rounded bg-gray-800 p-6">
        <form @submit.prevent="handleLogin" v-if="!loading && !successfulSignin">
            <input class="rounded bg-gray-600 p-4 bg-opacity-50" v-model="email" />
            <button type="submit">Log In</button>
        </form>

        <div v-if="successfulSignin">Check your email!</div>
    </div>
</template>
