using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ordo.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddGigDescriptionAndTimesheetEntry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Gigs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "TimesheetEntries",
                columns: table => new
                {
                    WorkerId = table.Column<string>(type: "text", nullable: false),
                    GigId = table.Column<string>(type: "text", nullable: false),
                    ClockIn = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ClockOut = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    IsConfirmed = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimesheetEntries", x => new { x.WorkerId, x.GigId });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimesheetEntries");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Gigs");
        }
    }
}
