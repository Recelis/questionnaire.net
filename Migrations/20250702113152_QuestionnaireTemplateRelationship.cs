using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LifeTracker.Migrations
{
    /// <inheritdoc />
    public partial class QuestionnaireTemplateRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_template",
                table: "template");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "template",
                newName: "questionnaire_id");

            migrationBuilder.AlterColumn<int>(
                name: "version",
                table: "template",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<int>(
                name: "questionnaire_id",
                table: "template",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "pk_template",
                table: "template",
                column: "version");

            migrationBuilder.CreateIndex(
                name: "ix_template_questionnaire_id",
                table: "template",
                column: "questionnaire_id");

            migrationBuilder.AddForeignKey(
                name: "fk_template_questionnaire",
                table: "template",
                column: "questionnaire_id",
                principalTable: "questionnaire",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_template_questionnaire",
                table: "template");

            migrationBuilder.DropPrimaryKey(
                name: "pk_template",
                table: "template");

            migrationBuilder.DropIndex(
                name: "ix_template_questionnaire_id",
                table: "template");

            migrationBuilder.RenameColumn(
                name: "questionnaire_id",
                table: "template",
                newName: "id");

            migrationBuilder.AlterColumn<int>(
                name: "version",
                table: "template",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<int>(
                name: "id",
                table: "template",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "pk_template",
                table: "template",
                column: "id");
        }
    }
}
