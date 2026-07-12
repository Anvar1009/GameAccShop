using Domain.Models.ChatModels;
using Domain.Models.PaymentModel;
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

        // Sotuvchi
        public int SellerId { get; set; }
        public User Seller { get; set; }

        // Xaridor
        public int BuyerId { get; set; }

        public User Buyer { get; set; }

        // Sotib olingan account
        public int ProductId { get; set; }

        public Product Product { get; set; }

        // Xarid vaqtidagi narx
        public decimal Price { get; set; }

        public OrderStatus Status { get; set; }

        // Buyer tasdiqlaganmi
        public bool IsBuyerConfirmed { get; set; }

        // Navigation
        public Payment Payment { get; set; }

        // Admin yakunlaganmi
        public bool IsCompletedByAdmin { get; set; }

        // order chati
        public Conversation? Conversation { get; set; }

       

        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
