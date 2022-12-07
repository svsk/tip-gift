export const usePageTitle = (pageTitle?: string) => {
    useHead({
        title: pageTitle ? `${pageTitle} | TipGift` : 'TipGift',
    });
};
