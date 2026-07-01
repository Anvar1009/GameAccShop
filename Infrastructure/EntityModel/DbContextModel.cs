using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using Domain.Models.ProductsModels;
using Domain.Models.UserModels;
using Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.EntityModel
{
    public class 
        DbContextModel:DbContext
    {
        public DbContextModel(DbContextOptions<DbContextModel> options)
        : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new OrderConfiguration());

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> Users { get; set; }  
        public DbSet<Product> products { get; set; }
        public DbSet<Order> orders { get; set; }
        public DbSet<ProductTag> ProductTags { get; set; }

        public DbSet<ProductMedia> ProductMedias { get; set; }

        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Dispute> Disputes { get; set; }
        public DbSet<Payment> Payment { get; set; }
        public DbSet<PaymentAccount> PaymentAccounts { get; set; }
    }
}
