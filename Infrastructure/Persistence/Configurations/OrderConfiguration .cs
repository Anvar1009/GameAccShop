using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Price)
                   .HasPrecision(18, 2);

            builder.Property(x => x.CreatedAt)
                   .HasDefaultValueSql("NOW()");

            // Buyer
            builder.HasOne(x => x.Buyer)
                   .WithMany(x => x.BuyOrders)
                   .HasForeignKey(x => x.BuyerId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Seller
            builder.HasOne(x => x.Seller)
                   .WithMany(x => x.SellOrders)
                   .HasForeignKey(x => x.SellerId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Product
            builder.HasOne(x => x.Product)
                   .WithMany()
                   .HasForeignKey(x => x.ProductId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Payment (One-To-One)
            builder.HasOne(x => x.Payment)
                   .WithOne(x => x.Order)
                   .HasForeignKey<Payment>(x => x.OrderId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}