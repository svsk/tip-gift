export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('ripple', {
        mounted: () => {},
        getSSRProps: () => ({}),
    });
});
