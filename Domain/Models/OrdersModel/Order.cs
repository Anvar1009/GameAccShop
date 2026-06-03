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
        public int BuyerId { get; set; }

        public User Buyer { get; set; }

        // Sotib olingan account
        public int ProductId { get; set; }

        public Product Product { get; set; }

        // Xarid vaqtidagi narx
        public decimal Price { get; set; }

        public OrderStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
