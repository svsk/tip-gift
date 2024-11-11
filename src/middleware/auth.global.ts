export default defineNuxtRouteMiddleware((to) => {
    const { user } = useUserSession();

    const exemptedRoutes = ['/login', '/api/auth/auth0'];
    if (exemptedRoutes.includes(to.path)) {
        return;
    }

    if (!user.value) {
        return navigateTo('/login');
    }
});
