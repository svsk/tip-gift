<script setup lang="ts">
import Input from '../Input.vue';

const supabase = useSupabaseClient();
const loading = ref(false);
const successfulSignin = ref(false);
const login = ref<InstanceType<typeof Input>>();
const loggingInWithGoogle = ref(false);

onMounted(() => {
    login.value?.focus();
});

const handleLogin = async () => {
    try {
        const redirectTarget = window.location.origin + '/confirm';

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTarget,
            },
        });

        if (error) throw error;
    } catch (error: any) {
        alert(error.error_description || error.message);
        loggingInWithGoogle.value = false;
    }
};

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
    <div class="py-8 w-full flex justify-center items-center">
        <Transition name="growDown">
            <Form
                class="w-full flex flex-col gap-4 items-center"
                @submit="handleLogin"
                v-if="!loading && !successfulSignin"
            >
                <div class="flex gap-4 flex-col w-full max-w-[450px]">
                    <Button type="submit"> Log in with Google </Button>

                    <div class="w-full text-center text-sm opacity-70">You can log in using your Google account!</div>
                </div>
            </Form>
        </Transition>
    </div>
</template>
7
