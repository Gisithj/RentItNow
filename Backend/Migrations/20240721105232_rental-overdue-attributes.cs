using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentItNow.Migrations
{
    public partial class rentaloverdueattributes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "rentalStatus",
                table: "RentalItem",
                newName: "RentalStatus");

            migrationBuilder.AddColumn<bool>(
                name: "isOverdue",
                table: "RentalItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "overdueDays",
                table: "RentalItem",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "rentalPrice",
                table: "RentalItem",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isOverdue",
                table: "RentalItem");

            migrationBuilder.DropColumn(
                name: "overdueDays",
                table: "RentalItem");

            migrationBuilder.DropColumn(
                name: "rentalPrice",
                table: "RentalItem");

            migrationBuilder.RenameColumn(
                name: "RentalStatus",
                table: "RentalItem",
                newName: "rentalStatus");
        }
    }
}
