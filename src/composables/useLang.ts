import type { LanguageStrings } from './languages/languageStrings';
import { enGb } from './languages/en-gb';
import { nbNo } from './languages/nb-no';

export enum SupportedLanguage {
    EnglishUK = 'en-gb',
    NorwegianBokmal = 'nb-no',
}

export const language = computed(() => {
    const defaultLanguage = SupportedLanguage.EnglishUK;

    const userId = useAuth().value?.id || '';
    const user = useUser(userId);

    return user.value?.PreferredLanguage || defaultLanguage;
});

const langLib = (lang: SupportedLanguage) => {
    const languages = {
        [SupportedLanguage.NorwegianBokmal]: nbNo,
        [SupportedLanguage.EnglishUK]: enGb,
    } as Record<SupportedLanguage, LanguageStrings>;

    return languages[lang as SupportedLanguage];
};

const localize = (tkey: keyof LanguageStrings, lang: SupportedLanguage, ...params: string[]) => {
    const lib = langLib(lang);
    const localized = lib[tkey] || tkey;

    return params.reduce((acc, param, i) => {
        const regex = new RegExp(`\\{${i}\\}`, 'g');
        return acc.replace(regex, param);
    }, localized);
};

export const useI18n = async () => {
    const defaultLanguage = SupportedLanguage.EnglishUK;

    const userId = useAuth().value?.id || '';
    const user = !!userId ? await loadUser(userId) : null;
    const lang = (user?.value?.PreferredLanguage || defaultLanguage) as SupportedLanguage;

    return {
        i18n: (tkey: keyof LanguageStrings, ...params: string[]) => localize(tkey, lang, ...params),
    };
};
