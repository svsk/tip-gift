// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxtjs/supabase'],
    css: ['~/assets/css/main.scss'],
    compatibilityDate: '2024-10-13',
    nitro: {
        routeRules: {
            '/confirm': {
                ssr: false,
            },
        },
    },
    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            exclude: ['/wishes/**', '/embed/**', '/gift-tag/**'],
        },
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
});
