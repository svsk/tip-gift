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
        [SupportedLanguage.NorwegianBokmal]: {
            AddNew: 'Legg til',
            Reorder: 'Endre rekkefølge',
            Finish: 'Fullfør',
            MyWishLists: 'Mine Ønskelister',
            OwnedByYou: 'Opprettet av deg',
            MyWishes: 'Mine Ønsker',
            GroupHelpText:
                'Lag eller bli med i grupper sammen med ulike venner og familiemedlemmer. Velg selv hvilke ønsker du vil dele med hvilke grupper.',
            GroupWishesExplanation:
                'Trykk på medlemmer av gruppen for å se deres delte ønsker. Trykk på deg selv for å administrere hvilke ønsker du vil vise til andre medlemmer av gruppen.',
            AddGroup: 'Opprett Gruppe',
            AddUser: 'Legg til Bruker',
            Edit: 'Rediger',
            EditGroup: 'Rediger Gruppe',
            GroupName: 'Gruppenavn',
            ShoppingList: 'Handleliste',
            AddYourWishesHere: 'Legg til dine ønsker her',
            ItemsYouveReserved: 'Produkter du planlegger å gi bort',
            NothingHereYet: 'Ingenting her enda',
            Close: 'Lukk',
            ShareWishList: 'Del Ønskeliste',
            Cancel: 'Avbryt',
            Confirm: 'Bekreft',
            User: 'Bruker',
            NoGroupsYet: 'Du har ikke laget eller blitt med i noen grupper enda',
            ListName: 'Listenavn',
            CreateLink: 'Opprett lenke',
            EditWish: 'Rediger Ønske',
            Link: 'Lenke',
            AddNewWish: 'Legg til Ønske',
            FetchInfo: 'Hent Info',
            Title: 'Tittel',
            Description: 'Beskrivelse',
            Price: 'Pris',
            DeleteWish: 'Fjern Ønske',
            DeleteConfirmation: 'Er du sikker på at du ønsker å fjerne {0} fra listen?',
            Delete: 'Fjern',
            Profile: 'Min Side',
            DisplayName: 'Visningsnavn',
            LogOut: 'Logg Ut',
            Language: 'Språk',
            OwnedBy: 'Opprettet av',
            Members: 'Medlemmer',
            Member: 'Medlem',
            WishAdded: 'Ønsket ble laget til! Husk å dele det med gruppene dine!',
            DeleteGroup: 'Slett Gruppe',
            GroupDeleteConfirmation: "Er du sikker på at du ønsker å slette '{0}'?",
            RemoveBoughtWish: 'Fjern kjøpt produkt?',
            ConfirmRemoveBoughtWish: "Vil du fjerne kjøpsmarkerningen fra '{0}'?",
            ShowGivers: 'Vis givere',
            No: 'Nei',
            Yes: 'Ja',
            MyGroups: 'Mine Grupper',
            MyProfile: 'Min Side',
            Required: 'Påkrevd',
            MyChecklist: 'Min Sjekkliste',
            ChecklistExplanation: 'Dette er en sjekkliste for å holde styr på dine gavekjøp, og deres status.',
            MarkAsPurchased: 'Marker som kjøpt',
            MarkAsWrapped: 'Marker som innpakket',
            MarkAsGiven: 'Marker som gitt',
            MarkAsShipmentReceived: 'Marker som Mottatt',
            GiftFor: 'Til',
        },
        [SupportedLanguage.EnglishUK]: {
            AddNew: 'Add New',
            Finish: 'Finish',
            Reorder: 'Reorder',
            MyWishLists: 'My Wish Lists',
            OwnedByYou: 'Owned by you',
            MyWishes: 'My Wishes',
            Edit: 'Edit',
            EditGroup: 'Edit Group',
            GroupName: 'Group Name',
            GroupHelpText:
                'Join different groups with different sets of friends and family. Choose what wishes to share with which group.',
            GroupWishesExplanation:
                'Click on members of the group to view their shared wishes. Click on yourself to manage what wishes to show to other members of the group.',
            AddGroup: 'Add Group',
            AddUser: 'Add User',
            ShoppingList: 'Shopping List',
            AddYourWishesHere: 'Add your wishes here',
            ItemsYouveReserved: "Items you're planning to gift",
            NothingHereYet: 'Nothing here yet',
            Close: 'Close',
            ShareWishList: 'Share Wish List',
            Cancel: 'Cancel',
            Confirm: 'Confirm',
            User: 'User',
            NoGroupsYet: 'No groups created or joined yet',
            ListName: 'List Name',
            CreateLink: 'Create link',
            EditWish: 'Edit Wish',
            Link: 'Link',
            AddNewWish: 'Add New Wish',
            FetchInfo: 'Fetch Info',
            Title: 'Title',
            Description: 'Description',
            Price: 'Price',
            DeleteWish: 'Delete Wish',
            DeleteConfirmation: 'Are you sure you want to delete {0} from the list?',
            Delete: 'Delete',
            Profile: 'Profile',
            DisplayName: 'Display Name',
            LogOut: 'Log Out',
            Language: 'Language',
            OwnedBy: 'Owned by',
            Members: 'Members',
            Member: 'Member',
            WishAdded: 'Wish added! Remember to share it with your groups!',
            DeleteGroup: 'Delete Group',
            GroupDeleteConfirmation: "Are you sure you want to delete '{0}'?",
            RemoveBoughtWish: 'Remove bought product?',
            ConfirmRemoveBoughtWish: "Do you want to remove your bought-indication from '{0}'?",
            ShowGivers: 'Show Givers',
            No: 'No',
            Yes: 'Yes',
            MyGroups: 'My Groups',
            MyProfile: 'My Profile',
            Required: 'Required',
            MyChecklist: 'My Checklist',
            ChecklistExplanation: 'This is a checklist for you to keep track of your gift purchases, and their status.',
            MarkAsPurchased: 'Mark as Purchased',
            MarkAsWrapped: 'Mark as Wrapped',
            MarkAsGiven: 'Mark as Given',
            MarkAsShipmentReceived: 'Mark Shipment as Received',
            GiftFor: 'For',
        },
    } as Record<SupportedLanguage, Record<string, string>>;

    return languages[lang as SupportedLanguage];
};

export const i18n = (tkey: string, ...params: string[]) => {
    const lang = language.value as SupportedLanguage;
    const lib = langLib(lang);
    const localized = lib[tkey] || tkey;

    return params.reduce((acc, param, i) => {
        const regex = new RegExp(`\\{${i}\\}`, 'g');
        return acc.replace(regex, param);
    }, localized);
};
