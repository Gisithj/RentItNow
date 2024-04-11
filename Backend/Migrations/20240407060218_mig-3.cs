using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentItNow.Migrations
{
    public partial class mig3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RenterId",
                table: "RentalItem",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_RentalItem_RenterId",
                table: "RentalItem",
                column: "RenterId");

            migrationBuilder.AddForeignKey(
                name: "FK_RentalItem_Renters_RenterId",
                table: "RentalItem",
                column: "RenterId",
                principalTable: "Renters",
                principalColumn: "RenterId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RentalItem_Renters_RenterId",
                table: "RentalItem");

            migrationBuilder.DropIndex(
                name: "IX_RentalItem_RenterId",
                table: "RentalItem");

            migrationBuilder.DropColumn(
                name: "RenterId",
                table: "RentalItem");
        }
    }
}
