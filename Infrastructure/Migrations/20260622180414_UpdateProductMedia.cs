using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductMedia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductMedias_products_ProductId1",
                table: "ProductMedias");

            migrationBuilder.DropIndex(
                name: "IX_ProductMedias_ProductId1",
                table: "ProductMedias");

            migrationBuilder.DropColumn(
                name: "ProductId1",
                table: "ProductMedias");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "ProductMedias",
                type: "integer",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMedias_ProductId",
                table: "ProductMedias",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductMedias_products_ProductId",
                table: "ProductMedias",
                column: "ProductId",
                principalTable: "products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductMedias_products_ProductId",
                table: "ProductMedias");

            migrationBuilder.DropIndex(
                name: "IX_ProductMedias_ProductId",
                table: "ProductMedias");

            migrationBuilder.AlterColumn<long>(
                name: "ProductId",
                table: "ProductMedias",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "ProductId1",
                table: "ProductMedias",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProductMedias_ProductId1",
                table: "ProductMedias",
                column: "ProductId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductMedias_products_ProductId1",
                table: "ProductMedias",
                column: "ProductId1",
                principalTable: "products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
