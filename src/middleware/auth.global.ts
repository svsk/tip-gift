export default defineNuxtRouteMiddleware((to) => {
    const auth = useSupabaseUser();

    if (to.path !== '/login' && to.path !== '/auth' && !auth.value) {
        return navigateTo('/login');
    }

    if (to.path === '/auth' && auth.value) {
        return navigateTo('/', { replace: true });
    }
});
