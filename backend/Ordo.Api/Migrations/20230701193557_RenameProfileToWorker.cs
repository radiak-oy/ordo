using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ordo.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameProfileToWorker : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileQualification");

            migrationBuilder.DropTable(
                name: "Profiles");

            migrationBuilder.CreateTable(
                name: "Workers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QualificationWorker",
                columns: table => new
                {
                    QualificationsId = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkersId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QualificationWorker", x => new { x.QualificationsId, x.WorkersId });
                    table.ForeignKey(
                        name: "FK_QualificationWorker_Qualifications_QualificationsId",
                        column: x => x.QualificationsId,
                        principalTable: "Qualifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QualificationWorker_Workers_WorkersId",
                        column: x => x.WorkersId,
                        principalTable: "Workers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QualificationWorker_WorkersId",
                table: "QualificationWorker",
                column: "WorkersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QualificationWorker");

            migrationBuilder.DropTable(
                name: "Workers");

            migrationBuilder.CreateTable(
                name: "Profiles",
                columns: table => new
                {
                    WorkerId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profiles", x => x.WorkerId);
                });

            migrationBuilder.CreateTable(
                name: "ProfileQualification",
                columns: table => new
                {
                    ProfilesWorkerId = table.Column<string>(type: "text", nullable: false),
                    QualificationsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileQualification", x => new { x.ProfilesWorkerId, x.QualificationsId });
                    table.ForeignKey(
                        name: "FK_ProfileQualification_Profiles_ProfilesWorkerId",
                        column: x => x.ProfilesWorkerId,
                        principalTable: "Profiles",
                        principalColumn: "WorkerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfileQualification_Qualifications_QualificationsId",
                        column: x => x.QualificationsId,
                        principalTable: "Qualifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfileQualification_QualificationsId",
                table: "ProfileQualification",
                column: "QualificationsId");
        }
    }
}
