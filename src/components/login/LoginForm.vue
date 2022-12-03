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
    <Card>
        <h1 class="self-start mb-2 text-2xl">Log In</h1>

        <div class="py-8 w-full flex justify-center items-center">
            <Transition name="growDown">
                <form class="w-full" @submit.prevent="handleLogin" v-if="!loading && !successfulSignin">
                    <div class="flex gap-4 flex-col">
                        <Input type="email" label="E-mail" v-model="email" />
                        <Button type="submit">Log In</Button>
                    </div>
                </form>
            </Transition>

            <Transition name="grow">
                <div v-if="successfulSignin" class="flex flex-col items-center gap-2 text-center">
                    <span class="text-4xl">📧</span>
                    <span>Check your email, and click the magic link!</span>
                    <span>You can close this tab.</span>
                </div>
            </Transition>
        </div>
    </Card>
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
