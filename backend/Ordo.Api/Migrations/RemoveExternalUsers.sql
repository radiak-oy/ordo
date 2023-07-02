START TRANSACTION;

DROP TABLE "ExternalUsers";

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230702092326_RemoveExternalUsers', '7.0.7');

COMMIT;
