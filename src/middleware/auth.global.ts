export default defineNuxtRouteMiddleware((to) => {
    if (to.path.startsWith('/wishes')) {
        return;
    }

    const auth = useSupabaseUser();
    if (to.path !== '/login' && to.path !== '/auth' && !auth.value) {
        return navigateTo('/login');
    }

    if (to.path === '/auth' && auth.value) {
        return navigateTo('/', { replace: true });
    }
});
