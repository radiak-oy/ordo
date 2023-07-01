START TRANSACTION;

DROP TABLE "ProfileQualification";

DROP TABLE "Profiles";

CREATE TABLE "Workers" (
    "Id" text NOT NULL,
    "Name" text NOT NULL,
    "Notes" text NOT NULL,
    CONSTRAINT "PK_Workers" PRIMARY KEY ("Id")
);

CREATE TABLE "QualificationWorker" (
    "QualificationsId" uuid NOT NULL,
    "WorkersId" text NOT NULL,
    CONSTRAINT "PK_QualificationWorker" PRIMARY KEY ("QualificationsId", "WorkersId"),
    CONSTRAINT "FK_QualificationWorker_Qualifications_QualificationsId" FOREIGN KEY ("QualificationsId") REFERENCES "Qualifications" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_QualificationWorker_Workers_WorkersId" FOREIGN KEY ("WorkersId") REFERENCES "Workers" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_QualificationWorker_WorkersId" ON "QualificationWorker" ("WorkersId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230701193557_RenameProfileToWorker', '7.0.7');

COMMIT;


