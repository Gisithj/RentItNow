using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentItNow.Migrations
{
    public partial class mig4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentalPrice",
                table: "Items");

            migrationBuilder.CreateTable(
                name: "ItemImage",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Base64Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemImage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemImage_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemSpecification",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpecificationFeature = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FeatureDetails = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemSpecification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemSpecification_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RentalOption",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RentalOptionName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalOption", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RentalOption_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemImage_ItemId",
                table: "ItemImage",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemSpecification_ItemId",
                table: "ItemSpecification",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalOption_ItemId",
                table: "RentalOption",
                column: "ItemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemImage");

            migrationBuilder.DropTable(
                name: "ItemSpecification");

            migrationBuilder.DropTable(
                name: "RentalOption");

            migrationBuilder.AddColumn<int>(
                name: "RentalPrice",
                table: "Items",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
