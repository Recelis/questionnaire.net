using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeTracker.Migrations
{
    /// <inheritdoc />
    public partial class MoveQuestionNumberToLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "question_number",
                table: "question");

            migrationBuilder.AddColumn<int>(
                name: "question_number",
                table: "template_question_link",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "question_number",
                table: "template_question_link");

            migrationBuilder.AddColumn<int>(
                name: "question_number",
                table: "question",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
