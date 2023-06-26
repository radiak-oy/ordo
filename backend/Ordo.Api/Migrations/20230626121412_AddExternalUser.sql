START TRANSACTION;

CREATE TABLE "ExternalUsers" (
    "Email" text NOT NULL,
    CONSTRAINT "PK_ExternalUsers" PRIMARY KEY ("Email")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230626121412_AddExternalUser', '7.0.7');

COMMIT;
