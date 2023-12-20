export type WishPurchaseWish = {
    Id: string;
    UserId: string;
    WishOwnerId: string;
    WishId: string;
    GroupId: string;
    CreatedDate: Date;
    PurchasedDate: Date | null;
    ShipmentReceivedDate: Date | null;
    WrappedDate: Date | null;
    GivenDate: Date | null;
    Name: string;
    ImageUrl: string | null;
    Link: string;
};

export type WishTag = {
    toName: string | null;
    fromName: string | null;
    toUserId: string | null;
    fromUserId: string | null;
    locked: boolean;
};
