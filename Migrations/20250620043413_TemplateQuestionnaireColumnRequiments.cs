using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeTracker.Migrations
{
    /// <inheritdoc />
    public partial class TemplateQuestionnaireColumnRequiments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Template",
                table: "Template");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Questionnaire",
                table: "Questionnaire");

            migrationBuilder.RenameTable(
                name: "Template",
                newName: "template");

            migrationBuilder.RenameTable(
                name: "Questionnaire",
                newName: "questionnaire");

            migrationBuilder.RenameColumn(
                name: "Version",
                table: "template",
                newName: "version");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "template",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "template",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "questionnaire",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "questionnaire",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "questionnaire",
                newName: "created_by");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "template",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "questionnaire",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "created_by",
                table: "questionnaire",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "pk_template",
                table: "template",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_questionnaire",
                table: "questionnaire",
                column: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_template",
                table: "template");

            migrationBuilder.DropPrimaryKey(
                name: "pk_questionnaire",
                table: "questionnaire");

            migrationBuilder.RenameTable(
                name: "template",
                newName: "Template");

            migrationBuilder.RenameTable(
                name: "questionnaire",
                newName: "Questionnaire");

            migrationBuilder.RenameColumn(
                name: "version",
                table: "Template",
                newName: "Version");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Template",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Template",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Questionnaire",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Questionnaire",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "Questionnaire",
                newName: "CreatedBy");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Template",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(250)",
                oldMaxLength: 250);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Questionnaire",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(250)",
                oldMaxLength: 250);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Questionnaire",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(250)",
                oldMaxLength: 250);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Template",
                table: "Template",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Questionnaire",
                table: "Questionnaire",
                column: "Id");
        }
    }
}
