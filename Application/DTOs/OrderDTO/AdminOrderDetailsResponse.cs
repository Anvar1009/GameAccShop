using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class AdminOrderDetailsResponse
    {
        // Order
        public int OrderId { get; set; }
        public OrderStatus Status { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; }

        // Buyer
        public int BuyerId { get; set; }
        public string BuyerName { get; set; }
        public string BuyerPhone { get; set; }

        // Seller
        public int SellerId { get; set; }
        public string SellerName { get; set; }
        public string SellerPhone { get; set; }

        // Product
        public int ProductId { get; set; }
        public string ProductDescription { get; set; }
        public int AccStrength { get; set; }
        public int PlayerCount { get; set; }
        public int CoinsCount { get; set; }

        public List<string> Tags { get; set; } = [];
        public List<string> Medias { get; set; } = [];

        // Payment
        public PaymentStatus PaymentStatus { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public decimal PaymentAmount { get; set; }

        // Payment Account
        public string CardNumber { get; set; }

        // Buyer Confirm
        public bool IsBuyerConfirmed { get; set; }

        // Admin
        public bool IsCompletedByAdmin { get; set; }
        public DateTime? CompletedAt { get; set; }


        public int ChatRoomId { get; set; }

        public bool IsChatOpened { get; set; }
    }
}
