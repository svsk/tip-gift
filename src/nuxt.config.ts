// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxtjs/supabase'],
    css: ['~/assets/css/main.scss'],
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
            exclude: ['/wishes/**', '/embed/**'],
        },
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
});
