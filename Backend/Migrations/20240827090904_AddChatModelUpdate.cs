using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentItNow.Migrations
{
    public partial class AddChatModelUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "Chats");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "Chats",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
