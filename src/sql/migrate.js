const fs = require('fs');
const sql = require('mssql');
require('dotenv').config();

const connectionParam = (param) =>
    param === 'server'
        ? (process.env.DATABASE_URL?.split(';') || [])
              .find((p) => p.includes('sqlserver://'))
              ?.split('//')[1]
              .split(':')[0]
        : (process.env.DATABASE_URL?.split(';') || []).find((p) => p.includes(`${param}=`))?.split('=')[1];

const sqlConfig = {
    server: connectionParam('server'),
    database: connectionParam('database'),
    user: connectionParam('user'),
    password: connectionParam('password'),
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: connectionParam('trustServerCertificate') === 'true',
    },
};

// Function to execute an SQL command
const executeSqlCommand = async (sqlCommand, transaction) => {
    return await transaction.request().query(sqlCommand);
};

const performMigration = async () => {
    let transaction;

    try {
        // Create a connection pool
        const pool = await sql.connect(sqlConfig);

        // Create a transaction
        transaction = new sql.Transaction(pool);

        // Begin the transaction
        await transaction.begin();

        await ensureMigrationHistoryTableExists(transaction);

        const currentVersion = await getCurrentVersion(transaction);

        // Find the relevant migrations
        const migrations = getUnappliedMigrations(currentVersion);

        // Loop through and execute the relevant migrations
        for (var i = 0; i < migrations.length; i++) {
            await executeSqlCommand(migrations[i].sql, transaction);
        }

        // Update the migration history table
        await updateMigrationHistory(transaction, migrations);

        // Commit if all migrations were successful
        await transaction.commit();
    } catch (err) {
        // Log error and rollback if any migrations failed
        console.error('Error executing SQL command:', err);
        await transaction?.rollback();
    } finally {
        // Close the connection pool
        sql.close();
    }
};

const ensureMigrationHistoryTableExists = async (transaction) => {
    const sqlCommand = `
        IF NOT EXISTS (
            SELECT * FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME = 'TipGiftMigrationHistory'
        )

        CREATE TABLE TipGiftMigrationHistory (
            Id INT IDENTITY(1,1) NOT NULL,
            Version VARCHAR(50) NOT NULL,
            Description VARCHAR(100) NOT NULL,
            AppliedOn DATETIME NOT NULL DEFAULT GETDATE()
        )
    `;

    await executeSqlCommand(sqlCommand, transaction);
};

const getCurrentVersion = async (transaction) => {
    const sqlCommand = `
        SELECT TOP 1 Version FROM TipGiftMigrationHistory
        ORDER BY Version DESC
    `;

    const result = await executeSqlCommand(sqlCommand, transaction);

    return result.recordset[0]?.Version || '197001010000000';
};

const getUnappliedMigrations = (latestAppliedVersion) => {
    const migrationsDirectory = __dirname + '/Migrations';

    const migrations = fs
        .readdirSync(migrationsDirectory)
        .map((fileName) => {
            const version = fileName.split('_')[0];

            if (version.length !== 15) {
                throw new Error(`Invalid migration file name: ${fileName}`);
            }

            const description = fileName.split('_')[1].split('.')[0];
            const sql = fs.readFileSync(`${migrationsDirectory}/${fileName}`, 'utf8');

            return { version, description, sql };
        })
        .filter((migration) => parseInt(migration.version) > parseInt(latestAppliedVersion))
        .sort((a, b) => a.version - b.version);

    return migrations;
};

const updateMigrationHistory = (transaction, appliedMigrations) => {
    if (appliedMigrations.length === 0) {
        console.log('Database is up to date!');
        return;
    }

    const sqlCommand = `
        INSERT INTO TipGiftMigrationHistory (Version, Description)
        VALUES ${appliedMigrations.map((migration) => `('${migration.version}', '${migration.description}')`).join(',')}
    `;

    return executeSqlCommand(sqlCommand, transaction);
};

// Execute the whole thing
performMigration();
