-- CreateTable
CREATE TABLE "Wish" (
    "Id" UUID NOT NULL,
    "Name" TEXT,
    "Description" TEXT,
    "Price" INTEGER NOT NULL,
    "Order" INTEGER NOT NULL,
    "Link" TEXT,
    "UserId" UUID NOT NULL,
    "GroupId" UUID NOT NULL,
    "ImageUrl" TEXT,
    "DeletedDate" TIMESTAMPTZ(3),
    "CreatedDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishUser" (
    "Id" UUID NOT NULL,
    "Email" TEXT NOT NULL,
    "Name" TEXT,
    "AvatarEmoji" VARCHAR(24),
    "AvatarColour" VARCHAR(24),
    "PreferredLanguage" VARCHAR(50),

    CONSTRAINT "WishUser_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishPurchase" (
    "Id" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "WishId" UUID,
    "GroupId" UUID,
    "CreatedDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "PurchasedDate" TIMESTAMPTZ(3),
    "WrappedDate" TIMESTAMPTZ(3),
    "GivenDate" TIMESTAMPTZ(3),
    "ShipmentReceivedDate" TIMESTAMPTZ(3),
    "IsCustom" BOOLEAN NOT NULL DEFAULT false,
    "ReceiverName" VARCHAR(255),
    "CustomName" VARCHAR(255),
    "DeletedDate" TIMESTAMPTZ(3),
    "DeletedByUserId" UUID,

    CONSTRAINT "WishPurchase_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishUserGroup" (
    "Id" UUID NOT NULL,
    "GroupName" TEXT NOT NULL,
    "CreatedByUserId" UUID,
    "AvatarEmoji" VARCHAR(24),
    "AvatarColour" VARCHAR(24),
    "InviteCode" VARCHAR(255),

    CONSTRAINT "WishUserGroup_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishUserGroupUser" (
    "Id" UUID NOT NULL,
    "GroupId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "LastVisitedDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DeletedDate" TIMESTAMPTZ(3),
    "DeletedByUserId" UUID,

    CONSTRAINT "WishUserGroupUser_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishListShare" (
    "Id" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "UniqueKey" VARCHAR(20) NOT NULL,
    "Slug" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "GroupId" UUID,

    CONSTRAINT "WishListShare_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishGroupWish" (
    "Id" UUID NOT NULL,
    "GroupId" UUID NOT NULL,
    "WishId" UUID NOT NULL,
    "WishGroupCollaborationId" UUID,
    "DeletedDate" TIMESTAMPTZ(3),
    "DeletedByUserId" UUID,

    CONSTRAINT "WishGroupWish_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishGiftTag" (
    "Id" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "WishPurchaseId" UUID NOT NULL,
    "FromText" VARCHAR(500),
    "ToText" VARCHAR(500),

    CONSTRAINT "WishGiftTag_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishGroupCollaboration" (
    "Id" UUID NOT NULL,
    "WishUserGroupId" UUID NOT NULL,
    "Title" TEXT,
    "AvatarColour" VARCHAR(24),
    "AvatarEmoji" VARCHAR(24),
    "CreatedByUserId" UUID,
    "CreatedDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DeletedByUserId" UUID,
    "DeletedDate" TIMESTAMPTZ(3),

    CONSTRAINT "WishGroupCollaboration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishGroupCollaborationMember" (
    "Id" UUID NOT NULL,
    "WishUserGroupId" UUID NOT NULL,
    "WishGroupCollaborationId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "IsAdmin" BOOLEAN NOT NULL,
    "CreatedDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedByUserId" UUID NOT NULL,
    "DeletedDate" TIMESTAMPTZ(3),
    "DeletedByUserId" UUID,

    CONSTRAINT "WishGroupCollaborationMember_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "WishPurchaseNote" (
    "Id" UUID NOT NULL,
    "WishPurchaseId" UUID NOT NULL,
    "Note" VARCHAR(150) NOT NULL,
    "CreatedDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedByUserId" UUID NOT NULL,
    "DeletedDate" TIMESTAMPTZ(3),
    "DeletedByUserId" UUID,

    CONSTRAINT "WishPurchaseNote_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WishListShare_UniqueKey_key" ON "WishListShare"("UniqueKey");
