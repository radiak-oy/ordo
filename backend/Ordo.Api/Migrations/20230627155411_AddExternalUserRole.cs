using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ordo.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddExternalUserRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "ExternalUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "ExternalUsers");
        }
    }
}
