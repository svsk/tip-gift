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
            options: {
                emailRedirectTo: window.location.origin + '/auth',
            },
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
    <div class="rounded bg-gray-800 p-6">
        <h1 class="self-start mb-2 text-2xl">Log In</h1>

        <div class="py-8 w-full flex justify-center items-center">
            <Transition name="growDown">
                <form class="w-full" @submit.prevent="handleLogin" v-if="!loading && !successfulSignin">
                    <div class="flex gap-4 flex-col">
                        <input
                            placeholder="E-mail"
                            class="flex-grow rounded bg-gray-600 p-4 bg-opacity-50"
                            v-model="email"
                        />
                        <button class="rounded bg-blue-600 py-2 px-4" type="submit">Log In</button>
                    </div>
                </form>
            </Transition>

            <Transition name="grow">
                <div v-if="successfulSignin" class="flex flex-col items-center gap-2">
                    <span class="text-4xl">📧</span>
                    Check your email, and click the magic link!
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.growDown-enter-active,
.growDown-leave-active {
    transition: all 0.1s linear;
}

.growDown-enter-from,
.growDown-leave-to {
    transform: translateY(-20);
    opacity: 0;
}

.grow-enter-active,
.grow-leave-active {
    transition: all 0.1s linear;
}

.grow-enter-from,
.grow-leave-to {
    transform: scale(0);
}
</style>
