// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['nuxt-auth-utils'],
    css: ['~/assets/css/main.scss'],
    compatibilityDate: '2024-10-13',
    nitro: {
        routeRules: {
            '/confirm': {
                ssr: false,
            },
        },
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
});
