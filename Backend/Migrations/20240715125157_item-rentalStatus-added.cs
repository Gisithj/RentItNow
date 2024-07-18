using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentItNow.Migrations
{
    public partial class itemrentalStatusadded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RentalStatus",
                table: "Items",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentalStatus",
                table: "Items");
        }
    }
}
