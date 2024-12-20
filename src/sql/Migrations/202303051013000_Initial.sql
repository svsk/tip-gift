-- Schema

-- Exit if WishUser already exists
IF OBJECT_ID('WishUser', 'U') IS NOT NULL
BEGIN
	PRINT 'Tables already exist. Considering the migration applied.'
	RETURN
END

-- DROP TABLE IF EXISTS [WishUser];
CREATE TABLE [WishUser] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Email] NVARCHAR(MAX) NOT NULL,
    [Name] NVARCHAR(MAX) NULL,
	[AvatarEmoji] NVARCHAR(24) NULL,
	[AvatarColour] NVARCHAR(24) NULL
);

-- DROP TABLE IF EXISTS [WishUserGroup];
CREATE TABLE [WishUserGroup] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [GroupName] NVARCHAR(MAX) NOT NULL,
	[CreatedByUserId] UNIQUEIDENTIFIER NULL
);

-- DROP TABLE IF EXISTS [WishUserGroupUser];
CREATE TABLE [WishUserGroupUser] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[GroupId] UNIQUEIDENTIFIER NOT NULL,
	[UserId] UNIQUEIDENTIFIER NOT NULL
);

-- DROP TABLE IF EXISTS [Wish];
CREATE TABLE [Wish] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Name] NVARCHAR(MAX) NULL,
    [Description] NVARCHAR(MAX) NULL,
    [Price] INT NOT NULL,
    [Order] INT NOT NULL,
    [Link] NVARCHAR(MAX) NULL,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[GroupId] UNIQUEIDENTIFIER NOT NULL,
	[ImageUrl] NVARCHAR(MAX) NULL
);

-- DROP TABLE IF EXISTS [WishGroupWish];
CREATE TABLE [WishGroupWish] (
	[Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[GroupId] UNIQUEIDENTIFIER NOT NULL,
	[WishId] UNIQUEIDENTIFIER NOT NULL
);

-- DROP TABLE IF EXISTS [WishPurchase];
CREATE TABLE [WishPurchase] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[WishId] UNIQUEIDENTIFIER NOT NULL,
	[GroupId] UNIQUEIDENTIFIER NOT NULL,
	[CreatedDate] DATETIMEOFFSET(5) DEFAULT GETUTCDATE() NOT NULL
);

-- DROP TABLE IF EXISTS [WishListShare];
CREATE TABLE [WishListShare] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[UniqueKey] NVARCHAR(20) NOT NULL UNIQUE,
	[Slug] NVARCHAR(1000) NOT NULL,
	[Name] NVARCHAR(1000) NOT NULL,
	[CreatedDate] DATETIMEOFFSET(5) DEFAULT GETUTCDATE() NOT NULL
);
