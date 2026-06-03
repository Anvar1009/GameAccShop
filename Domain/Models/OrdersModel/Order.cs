using Domain.Models.ProductsModels;
using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.OrdersModel
{
    public class Order
    {
        public int Id { get; set; }

        // Xaridor
        public int UserId { get; set; }

        public User User { get; set; }

        // Sotib olingan account
        public int ProductId { get; set; }

        public Product Product { get; set; }

        public decimal Price { get; set; }

        public OrderStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
