using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LifeTracker.Migrations
{
    /// <inheritdoc />
    public partial class addAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "created_by",
                table: "submission");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "questionnaire");

            migrationBuilder.AddColumn<int>(
                name: "user_id",
                table: "submission",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "user_id",
                table: "questionnaire",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    email = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    password_hash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_submission_user_id",
                table: "submission",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_questionnaire_user_id",
                table: "questionnaire",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_email",
                table: "user",
                column: "email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_user_questionnaire",
                table: "questionnaire",
                column: "user_id",
                principalTable: "user",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_user_submission",
                table: "submission",
                column: "user_id",
                principalTable: "user",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_user_questionnaire",
                table: "questionnaire");

            migrationBuilder.DropForeignKey(
                name: "fk_user_submission",
                table: "submission");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropIndex(
                name: "ix_submission_user_id",
                table: "submission");

            migrationBuilder.DropIndex(
                name: "ix_questionnaire_user_id",
                table: "questionnaire");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "submission");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "questionnaire");

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "submission",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "created_by",
                table: "questionnaire",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "");
        }
    }
}
