using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.PaymentDTO
{
    public class AdminPaymentDetailsResponse
    {
        // Payment
        public int PaymentId { get; set; }

        public int OrderId { get; set; }

        public decimal Amount { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public PaymentStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public DateTime? ReleasedAt { get; set; }

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

        public int Strength { get; set; }

        public int Coins { get; set; }

        public int PlayerCount { get; set; }

        public List<string> Tags { get; set; } = [];

        public List<string> Medias { get; set; } = [];

        // Payment Account
        public string AccountName { get; set; }

        public string OwnerName { get; set; }

        public string CardNumber { get; set; }

        // Receipt
        public string? ReceiptUrl { get; set; }

        // Order
        public OrderStatus OrderStatus { get; set; }

        public bool IsBuyerConfirmed { get; set; }

        public bool IsCompletedByAdmin { get; set; }

        // UI Actions
        public bool CanConfirmPayment { get; set; }

        public bool CanReleasePayment { get; set; }
    }
}
