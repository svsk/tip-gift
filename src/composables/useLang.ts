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

export interface LanguageStrings {
    AddNew: string;
    Finish: string;
    Reorder: string;
    MyWishLists: string;
    Wishes: string;
    OwnedByYou: string;
    MyWishes: string;
    Edit: string;
    EditGroup: string;
    GroupName: string;
    InviteExplanation: string;
    Join: string;
    GroupHelpText: string;
    GroupWishesExplanation: string;
    AddGroup: string;
    AddUser: string;
    InviteUser: string;
    ShoppingList: string;
    AddYourWishesHere: string;
    ItemsYouveReserved: string;
    NothingHereYet: string;
    Close: string;
    ShareWishList: string;
    Cancel: string;
    Confirm: string;
    Later: string;
    User: string;
    NoGroupsYet: string;
    ListName: string;
    CreateLink: string;
    EditWish: string;
    Link: string;
    AddNewWish: string;
    ShareNewWish: string;
    Share: string;
    FetchInfo: string;
    Title: string;
    Description: string;
    Price: string;
    DeleteWish: string;
    DeleteConfirmation: string;
    Delete: string;
    Profile: string;
    DisplayName: string;
    LogOut: string;
    Language: string;
    OwnedBy: string;
    Members: string;
    Member: string;
    WishAdded: string;
    WishDeleted: string;
    DeleteGroup: string;
    GroupDeleteConfirmation: string;
    RemoveBoughtWish: string;
    ConfirmRemoveBoughtWish: string;
    ShowGivers: string;
    No: string;
    Yes: string;
    MyGroups: string;
    MyProfile: string;
    Required: string;
    MyChecklist: string;
    ChecklistExplanation: string;
    MarkAsPurchased: string;
    MarkAsWrapped: string;
    MarkAsGiven: string;
    MarkAsShipmentReceived: string;
    GiftFor: string;
    JoinGroup: string;
    AlreadyAMember: string;
    FilterGiven: string;
    NewGroup: string;
    JoinOrAddNewGroup: string;
    InviteCode: string;
    CreateInviteCode: string;
    JoinGroupExplanation: string;
    VisitStore: string;
    ShowQRCode: string;
    GiftTag: string;
    AddCustomWishPurchase: string;
    ReceiverName: string;
    ProductName: string;
    Preview: string;
    To: string;
    From: string;
    Checklist: string;
    NoSharedWishesInfoText: string;
    New: string;
    Collaboration: string;
    DeleteCollaboration: string;
    ConfirmDeleteCollaboration: string;
    CollaborateWithWho: string;
    BoughtItemExplanation: string;
    LeaveGroup: string;
    LeaveGroupConfirmation: string;
}

const langLib = (lang: SupportedLanguage) => {
    const languages = {
        [SupportedLanguage.NorwegianBokmal]: {
            AddNew: 'Legg til',
            Reorder: 'Endre rekkefølge',
            Finish: 'Fullfør',
            MyWishLists: 'Mine Ønskelister',
            Wishes: 'Ønsker',
            OwnedByYou: 'Opprettet av deg',
            MyWishes: 'Mine Ønsker',
            GroupHelpText:
                'Lag eller bli med i grupper sammen med ulike venner og familiemedlemmer. Velg selv hvilke ønsker du vil dele med hvilke grupper.',
            GroupWishesExplanation:
                'Trykk på medlemmer av gruppen for å se deres delte ønsker. Trykk på deg selv for å administrere hvilke ønsker du vil vise til andre medlemmer av gruppen.',
            AddGroup: 'Opprett Gruppe',
            AddUser: 'Legg til Bruker',
            InviteUser: 'Inviter Bruker',
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
            Later: 'Senere',
            User: 'Bruker',
            NoGroupsYet: 'Du har ikke laget eller blitt med i noen grupper enda',
            ListName: 'Listenavn',
            CreateLink: 'Opprett lenke',
            EditWish: 'Rediger Ønske',
            Link: 'Lenke',
            Join: 'Bli Med',
            AddNewWish: 'Legg til Ønske',
            ShareNewWish: 'Del Ønske',
            Share: 'Del',
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
            WishAdded: 'Ønsket ble lagt til! Husk å dele det med gruppene dine!',
            WishDeleted: 'Ønsket ble slettet!',
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
            JoinGroup: 'Bli med i gruppe',
            AlreadyAMember: 'Allerede medlem',
            FilterGiven: 'Skjul gitte gaver',
            NewGroup: 'Ny Gruppe',
            JoinOrAddNewGroup: 'Bli med i en gruppe eller opprett en helt ny!',
            InviteCode: 'Invitasjonskode',
            CreateInviteCode: 'Opprett Invitasjonskode',
            JoinGroupExplanation: 'Skriv inn invitasjonskoden fra gruppeeieren for å bli med i gruppen.',
            VisitStore: 'Gå til Butikk',
            ShowQRCode: 'Vis Til/Fra-lapp',
            GiftTag: 'Til/Fra-lapp',
            AddCustomWishPurchase: 'Legg til Egendefinert Kjøp',
            ReceiverName: 'Mottaker',
            ProductName: 'Produktnavn',
            Preview: 'Forhåndsvis',
            To: 'Til',
            From: 'Fra',
            Checklist: 'Sjekkliste',
            InviteExplanation:
                'Inviter venner og familie til å bli med i gruppen din ved å dele invitasjonskoden med dem. Klikk for å kopiere og send den til vennene dine!',
            NoSharedWishesInfoText: `Denne personen har ikke delt noen ønsker med denne gruppen enda.`,
            New: 'Ny',
            Collaboration: 'Fellesønsker',
            DeleteCollaboration: 'Slett Fellesønsker',
            ConfirmDeleteCollaboration: 'Er du sikker på at du ønsker å slette disse fellesønskene?',
            CollaborateWithWho: 'Hvem vil du ha fellesønsker med?',
            BoughtItemExplanation:
                'Er du sikker på at du vil varsle gruppen om at du gir denne gaven? Mottakeren vil selvfølgelig ikke bli varslet.',
            LeaveGroup: 'Forlat Gruppe',
            LeaveGroupConfirmation: 'Er du sikker på at du ønsker å forlate gruppen?',
        } as LanguageStrings,
        [SupportedLanguage.EnglishUK]: {
            AddNew: 'Add New',
            Finish: 'Finish',
            Reorder: 'Reorder',
            MyWishLists: 'My Wish Lists',
            Wishes: 'Wishes',
            OwnedByYou: 'Owned by you',
            MyWishes: 'My Wishes',
            Edit: 'Edit',
            EditGroup: 'Edit Group',
            GroupName: 'Group Name',
            InviteExplanation:
                'Invite your friends and family to join your group by sharing the invite code with them. Click to copy it and send it to your friends!',
            Join: 'Join',
            GroupHelpText:
                'Join different groups with different sets of friends and family. Choose what wishes to share with which group.',
            GroupWishesExplanation:
                'Click on members of the group to view their shared wishes. Click on yourself to manage what wishes to show to other members of the group.',
            AddGroup: 'Add Group',
            AddUser: 'Add User',
            InviteUser: 'Invite User',
            ShoppingList: 'Shopping List',
            AddYourWishesHere: 'Add your wishes here',
            ItemsYouveReserved: "Items you're planning to gift",
            NothingHereYet: 'Nothing here yet',
            Close: 'Close',
            ShareWishList: 'Share Wish List',
            Cancel: 'Cancel',
            Confirm: 'Confirm',
            Later: 'Later',
            User: 'User',
            NoGroupsYet: 'No groups created or joined yet',
            ListName: 'List Name',
            CreateLink: 'Create link',
            EditWish: 'Edit Wish',
            Link: 'Link',
            AddNewWish: 'Add New Wish',
            ShareNewWish: 'Share New Wish',
            Share: 'Share',
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
            WishDeleted: 'Wish deleted!',
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
            JoinGroup: 'Join Group',
            AlreadyAMember: 'Already a member',
            FilterGiven: 'Hide given gifts',
            NewGroup: 'New Group',
            JoinOrAddNewGroup: 'Join a group or add a brand new one!',
            InviteCode: 'Invite Code',
            CreateInviteCode: 'Create Invite Code',
            JoinGroupExplanation: 'Enter the invite code you received from the group creator to join the group.',
            VisitStore: 'Visit Store',
            ShowQRCode: 'Show Gift Tag',
            GiftTag: 'Gift Tag',
            AddCustomWishPurchase: 'Add Custom Purchase',
            ReceiverName: 'Receiver',
            ProductName: 'Product Name',
            Preview: 'Preview',
            To: 'To',
            From: 'From',
            Checklist: 'Checklist',
            NoSharedWishesInfoText: `This person hasn't shared any wishes with this group yet.`,
            New: 'New',
            Collaboration: 'Collaboration',
            DeleteCollaboration: 'Delete Collaboration',
            ConfirmDeleteCollaboration: 'Are you sure you want to delete this collaboration?',
            CollaborateWithWho: 'Who do you want to create collaborative wishes with?',
            BoughtItemExplanation:
                "Are you sure you want to notify the group that you're giving this gift? The receiver will obviously not be notified.",
            LeaveGroup: 'Leave Group',
            LeaveGroupConfirmation: 'Are you sure you want to leave the group?',
        } as LanguageStrings,
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
