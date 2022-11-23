DROP TABLE [Wish];

CREATE TABLE [Wish] (
    [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    [Name] VARCHAR(MAX) NULL,
    [Description] VARCHAR(MAX) NULL,
    [Price] INT NOT NULL,
    [Order] INT NOT NULL,
    [Link] VARCHAR(MAX) NULL
);

DELETE FROM [Wish] WHERE [Id] IS NOT NULL;
INSERT INTO [Wish] ([Order], [Name], [Price], [Link]) VALUES (1, 'Dell S2721DGFA 27" Gaming QHD IPS', 3265, 'https://www.prisjakt.no/product.php?p=5631628');
INSERT INTO [Wish] ([Order], [Name], [Price], [Link]) VALUES (2, 'Lagavulin Single Malt 16 Years Old', 889, 'https://www.vinmonopolet.no/Land/Skottland/Lagavulin-Single-Malt-16-Years-Old/p/464401');
INSERT INTO [Wish] ([Order], [Name], [Price], [Link]) VALUES (3, 'Comandante C40 Nitro Blade Kaffekvern', 2699, 'https://black-cat.no/products/comandante-c40-nitro-blade-kaffekvern?variant=40134866370643');
SELECT * FROM [Wish];
