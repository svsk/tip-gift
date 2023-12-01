<script setup lang="ts">
const loginMethod = ref('email');
const user = useSupabaseUser();

watch(
    () => user,
    () => {
        if (user.value) {
            navigateTo('/');
        }
    },
    { immediate: true }
);
</script>

<template>
    <Card>
        <PageHeader> Login </PageHeader>

        <div class="w-full flex items-center justify-center">
            <ButtonToggle
                class="w-full max-w-[450px]"
                v-model="loginMethod"
                :options="[
                    { value: 'email', label: 'E-mail' },
                    { value: 'google', label: 'Google' },
                ]"
            />
        </div>

        <TransitionGroup name="slidePast">
            <LoginEmailForm key="email" v-if="loginMethod === 'email'" />
            <LoginGoogleForm key="google" v-else-if="loginMethod === 'google'" />
        </TransitionGroup>
    </Card>
</template>
