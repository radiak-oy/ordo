START TRANSACTION;

ALTER TABLE "ExternalUsers" ADD "Role" text NOT NULL DEFAULT '';

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230627155411_AddExternalUserRole', '7.0.7');

COMMIT;
