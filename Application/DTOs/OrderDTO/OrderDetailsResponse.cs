using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class OrderDetailsResponse
    {
        public int OrderId { get; set; }

        public OrderStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        // Product
        public int ProductId { get; set; }

        public string ProductImage { get; set; }

        public int Strength { get; set; }

        public int Coins { get; set; }

        public int PlayerCount { get; set; }

        public decimal Price { get; set; }

        public string Description { get; set; }

        // Seller
        public int SellerId { get; set; }

        public string SellerName { get; set; }

        public string SellerPhone { get; set; }

        // Payment
        public PaymentStatus PaymentStatus { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public DateTime? PaymentConfirmedAt { get; set; }

        // Order
        public bool IsBuyerConfirmed { get; set; }

        public bool IsCompletedByAdmin { get; set; }

        public DateTime? CompletedAt { get; set; }

        // UI Actions
        public bool CanOpenChat { get; set; }

        public bool CanCancelOrder { get; set; }

        public bool CanConfirmOrder { get; set; }

        public bool CanOpenDispute { get; set; }
    }
}
