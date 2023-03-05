-- Schema
DROP TABLE IF EXISTS [WishUser];
CREATE TABLE [WishUser] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Email] VARCHAR(MAX) NOT NULL,
    [Name] VARCHAR(MAX) NULL
);

DROP TABLE IF EXISTS [WishUserGroup];
CREATE TABLE [WishUserGroup] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [GroupName] VARCHAR(MAX) NOT NULL
);

DROP TABLE IF EXISTS [WishUserGroupUser];
CREATE TABLE [WishUserGroupUser] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[GroupId] UNIQUEIDENTIFIER NOT NULL,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[AvatarEmoji] VARCHAR(24) NULL,
	[AvatarColour] VARCHAR(24) NULL
);

DROP TABLE IF EXISTS [Wish];
CREATE TABLE [Wish] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Name] VARCHAR(MAX) NULL,
    [Description] VARCHAR(MAX) NULL,
    [Price] INT NOT NULL,
    [Order] INT NOT NULL,
    [Link] VARCHAR(MAX) NULL,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[GroupId] UNIQUEIDENTIFIER NOT NULL,
	[ImageUrl] VARCHAR(MAX) NULL
);

DROP TABLE IF EXISTS [WishGroupWish];
CREATE TABLE [WishGroupWish] (
	[Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[GroupId] UNIQUEIDENTIFIER NOT NULL,
	[WishId] UNIQUEIDENTIFIER NOT NULL
);

DROP TABLE IF EXISTS [WishPurchase];
CREATE TABLE [WishPurchase] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[WishId] UNIQUEIDENTIFIER NOT NULL,
	[GroupId] UNIQUEIDENTIFIER NOT NULL,
	[CreatedDate] DATETIMEOFFSET(5) DEFAULT GETUTCDATE() NOT NULL
);

DROP TABLE IF EXISTS [WishListShare];
CREATE TABLE [WishListShare] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[UniqueKey] VARCHAR(20) NOT NULL UNIQUE,
	[Slug] VARCHAR(1000) NOT NULL,
	[Name] VARCHAR(1000) NOT NULL,
	[CreatedDate] DATETIMEOFFSET(5) DEFAULT GETUTCDATE() NOT NULL
);

-- Data
DELETE FROM [WishUser] WHERE [Id] IS NOT NULL;
INSERT INTO [WishUser] ([Email], [Name]) VALUES ('sverre.skuland@gmail.com', 'Sverre');
DECLARE @UserId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [WishUser]);

INSERT INTO [WishUserGroup] ([GroupName]) VALUES ('Sverre''s Group');
DECLARE @Groupid UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [WishUserGroup]);

INSERT INTO [WishUserGroupUser] ([UserId], [GroupId]) VALUES (@UserId, @GroupId);

DELETE FROM [Wish] WHERE [Id] IS NOT NULL;
INSERT INTO [Wish] (
	[Order],
	[Name],
	[Price],
	[Link],
	[UserId],
	[GroupId]
) VALUES (
	1,
	'Dell S2721DGFA 27" Gaming QHD IPS',
	3265,
	'https://www.prisjakt.no/product.php?p=5631628',
	@UserId,
	@GroupId
);

INSERT INTO [Wish] (
	[Order],
	[Name],
	[Price],
	[Link],
	[UserId],
	[GroupId]
) VALUES (
	2,
	'Lagavulin Single Malt 16 Years Old',
	889,
	'https://www.vinmonopolet.no/Land/Skottland/Lagavulin-Single-Malt-16-Years-Old/p/464401',
	@UserId,
	@GroupId
);

INSERT INTO [Wish] (
	[Order],
	[Name],
	[Price],
	[Link],
	[UserId],
	[GroupId]
) VALUES (
	3,
	'Comandante C40 Nitro Blade Kaffekvern',
	2699,
	'https://black-cat.no/products/comandante-c40-nitro-blade-kaffekvern?variant=40134866370643',
	@UserId,
	@GroupId
);
