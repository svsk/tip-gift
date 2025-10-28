const fs = require('fs');

let sqlServerScript = fs.readFileSync("tipgift.local.sql", "utf16le");

// Remove BOM (Byte Order Mark) if present
if (sqlServerScript.charCodeAt(0) === 0xFEFF) {
    sqlServerScript = sqlServerScript.slice(1);
}

const convertBools = (line) => {
    return line.replaceAll(', 1, ', ', TRUE, ')
        .replaceAll(', 0, ', ', FALSE, ');
}

const shouldCommit = false;

const dateTimeOffsetPattern = /CAST\('([^']+)' AS DateTimeOffset\)/g;

const postgresScript =
    "BEGIN;\n\n" +
    sqlServerScript
        .replaceAll("[", '"')
        .replaceAll("]", '"')
        .replaceAll('"dbo".', '')
        .replaceAll("INSERT", "INSERT INTO")
        .replaceAll("N'", "'")
        .replaceAll(dateTimeOffsetPattern, "'$1'::TIMESTAMPTZ")
        .replaceAll("\r\nGO\r\n", "\r\n\r\n")
        .replaceAll(')\r\n', ');\r\n')
        .split('\r\n')
        .map(line => {
            const tablesWithBools = [
                "WishGroupCollaborationMember",
                "WishPurchase",
            ];

            if (tablesWithBools.some(table => line.includes(`INTO "${table}"`))) {
                line = convertBools(line);
            }

            return line;
        }).join('\r\n')
    + (shouldCommit ? "\nCOMMIT;\n" : "\nROLLBACK;\n")
    ;

fs.writeFileSync("tipgift_postgres.local.sql", postgresScript, "utf8");