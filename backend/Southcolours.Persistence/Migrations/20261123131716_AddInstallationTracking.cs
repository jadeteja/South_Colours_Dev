using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Southcolours.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddInstallationTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InstallationMarkers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InstallationId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    InstalledAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InstalledVersion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BootstrapCompleted = table.Column<bool>(type: "bit", nullable: false),
                    OperationId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstallationMarkers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SeedHistoryEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SeedId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Version = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AppliedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OperationId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeedHistoryEntries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InstallationMarkers_InstallationId",
                table: "InstallationMarkers",
                column: "InstallationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SeedHistoryEntries_SeedId",
                table: "SeedHistoryEntries",
                column: "SeedId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InstallationMarkers");

            migrationBuilder.DropTable(
                name: "SeedHistoryEntries");
        }
    }
}
