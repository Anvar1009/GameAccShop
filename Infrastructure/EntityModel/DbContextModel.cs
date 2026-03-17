using Domain.Models.ProductsModels;
using Domain.Models.UserModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.EntityModel
{
    public class DbContextModel:DbContext
    {
        public DbContextModel(DbContextOptions<DbContextModel> options)
        : base(options)
        {
        }
        public DbSet<User> Users { get; set; }  
        public DbSet<Product> products { get; set; }

    }
}
