using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeTracker.Migrations
{
    /// <inheritdoc />
    public partial class AnswerTextToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "text",
                table: "answer",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "text",
                table: "answer",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);
        }
    }
}
