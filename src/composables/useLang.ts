export enum SupportedLanguage {
    EnglishUK = 'en-gb',
    NorwegianBokmal = 'nb-no',
}

export const i18n = (lang: SupportedLanguage) => {
    const languages = {
        [SupportedLanguage.NorwegianBokmal]: {
            MyWishLists: 'Mine Ønskelister',
            OwnedByYou: 'Eid av deg',
            MyWishes: 'Mine Ønsker',
            GroupHelpText:
                'Lag eller bli med i grupper sammen med ulike venner og familiemedlemmer. Velg selv hvilke ønsker du vil dele med hvilke grupper.',
            AddGroup: 'Opprett Gruppe',
        },
        [SupportedLanguage.EnglishUK]: {
            MyWishLists: 'My Wish Lists',
            OwnedByYou: 'Owned by you',
            MyWishes: 'My Wishes',
            GroupHelpText:
                'Join different groups with different sets of friends and family. Choose what wishes to share with which group.',
            AddGroup: 'Add Group',
        },
    };

    return languages[lang];
};
