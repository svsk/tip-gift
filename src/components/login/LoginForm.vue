<script setup lang="ts">
import Input from '../Input.vue';

const supabase = useSupabaseClient();
const email = cachedRef('last-login-email', '');
const loading = ref(false);
const successfulSignin = ref(false);
const login = ref<InstanceType<typeof Input>>();

const handleLogin = async () => {
    loading.value = true;

    try {
        const redirectTarget = window.location.origin + '/confirm';

        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
            options: {
                emailRedirectTo: redirectTarget,
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

onMounted(() => {
    login.value?.focus();
});

const required = (val: any) => {
    return !!val ? true : 'Required';
};

const mustBeEmail = (val: string) => {
    return val.includes('@') && val.length > 2 && val.at(0) !== '@' && val.at(-1) !== '@'
        ? true
        : 'Must be an e-mail address';
};
</script>

<template>
    <Card>
        <h1 class="self-start mb-2 text-2xl">Log In</h1>

        <div class="py-8 w-full flex justify-center items-center">
            <Transition name="growDown">
                <Form
                    class="w-full flex flex-col gap-4 items-center"
                    @submit="handleLogin"
                    v-if="!loading && !successfulSignin"
                >
                    <div class="flex gap-4 flex-col w-full max-w-[450px]">
                        <Input
                            ref="login"
                            name="Email"
                            type="email"
                            label="E-mail"
                            v-model="email"
                            :rules="[required, mustBeEmail]"
                        />
                        <Button type="submit">Log In</Button>

                        <div class="w-full text-center text-sm opacity-70">
                            Don't have an account? Don't worry!<br />We only need your e-mail address to log you in.
                        </div>
                    </div>
                </Form>
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
7
