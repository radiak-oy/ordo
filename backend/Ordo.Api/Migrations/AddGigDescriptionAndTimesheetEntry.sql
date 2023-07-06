START TRANSACTION;

ALTER TABLE "Gigs" ADD "Description" text NOT NULL DEFAULT '';

CREATE TABLE "TimesheetEntries" (
    "WorkerId" text NOT NULL,
    "GigId" text NOT NULL,
    "ClockIn" timestamp with time zone NOT NULL,
    "ClockOut" timestamp with time zone NOT NULL,
    "IsConfirmed" boolean NOT NULL,
    CONSTRAINT "PK_TimesheetEntries" PRIMARY KEY ("WorkerId", "GigId")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20230706143314_AddGigDescriptionAndTimesheetEntry', '7.0.7');

COMMIT;
