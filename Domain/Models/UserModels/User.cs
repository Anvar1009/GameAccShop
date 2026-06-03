using Domain.Models.Abstracts;
using Domain.Models.OrdersModel;
using Domain.Models.ProductsModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.UserModels
{
    public class User
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Login { get; set; }

        public string PasswordHash { get; set; }

        public string PhoneNumber { get; set; }

        public Role Role { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        // Sotuvga qo'ygan accountlari
        public ICollection<Product> Products { get; set; }
            = new List<Product>();

        // Xaridlari
        public ICollection<Order> Orders { get; set; }
            = new List<Order>();
    }
}
