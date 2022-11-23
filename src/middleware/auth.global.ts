export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuth();

    if (to.path !== '/login' && !auth.value?.isAuthenticated) {
        return navigateTo('/login');
    }
});
