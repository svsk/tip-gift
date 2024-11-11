export default defineNuxtRouteMiddleware((to) => {
    const { user } = useUserSession();

    const exemptedRoutes = ['/login', '/api/auth/auth0'];
    if (exemptedRoutes.includes(to.path)) {
        return;
    }

    const exemptedPatterns = ['/wishes/', '/embed/', '/gift-tag/'];
    if (exemptedPatterns.some((pattern) => to.path.startsWith(pattern))) {
        return;
    }

    if (!user.value) {
        return navigateTo('/login');
    }
});
