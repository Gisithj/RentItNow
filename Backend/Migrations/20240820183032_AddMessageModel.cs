using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentItNow.Migrations
{
    public partial class AddMessageModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalOption_Items_ItemId",
                table: "RentalOption");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RentalOption",
                table: "RentalOption");

            migrationBuilder.RenameTable(
                name: "RentalOption",
                newName: "RentalOptions");

            migrationBuilder.RenameIndex(
                name: "IX_RentalOption_ItemId",
                table: "RentalOptions",
                newName: "IX_RentalOptions_ItemId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RentalOptions",
                table: "RentalOptions",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SenderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReceiverId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_AspNetUsers_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Messages_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReceiverId",
                table: "Messages",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderId",
                table: "Messages",
                column: "SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalOptions_Items_ItemId",
                table: "RentalOptions",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalOptions_Items_ItemId",
                table: "RentalOptions");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RentalOptions",
                table: "RentalOptions");

            migrationBuilder.RenameTable(
                name: "RentalOptions",
                newName: "RentalOption");

            migrationBuilder.RenameIndex(
                name: "IX_RentalOptions_ItemId",
                table: "RentalOption",
                newName: "IX_RentalOption_ItemId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RentalOption",
                table: "RentalOption",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalOption_Items_ItemId",
                table: "RentalOption",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
