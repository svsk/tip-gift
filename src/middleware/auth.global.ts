export default defineNuxtRouteMiddleware((to) => {
    const auth = useSupabaseUser();

    if (to.path !== '/login' && !auth.value) {
        return navigateTo('/login');
    }
});
