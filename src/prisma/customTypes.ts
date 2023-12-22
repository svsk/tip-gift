export type WishPurchaseWish = {
    Id: string;
    UserId: string;
    ReceiverName: string;
    WishOwnerId: string | null;
    WishId: string | null;
    GroupId: string | null;
    CreatedDate: Date;
    PurchasedDate: Date | null;
    ShipmentReceivedDate: Date | null;
    WrappedDate: Date | null;
    GivenDate: Date | null;
    Name: string;
    ImageUrl: string | null;
    Link: string;
    IsCustom: boolean;
};

export type WishTag = {
    toText: string | null;
    fromText: string | null;
    toUserId: string | null;
    fromUserId: string | null;
    locked: boolean;
};
