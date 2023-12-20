ALTER TABLE WishPurchase ALTER COLUMN GroupId UNIQUEIDENTIFIER NULL;
ALTER TABLE WishPurchase ALTER COLUMN WishId UNIQUEIDENTIFIER NULL;

ALTER TABLE WishPurchase ADD IsCustom BIT NOT NULL DEFAULT 0;
ALTER TABLE WishPurchase ADD ReceiverName NVARCHAR(255) NULL;
ALTER TABLE WishPurchase ADD CustomName NVARCHAR(255) NULL;
