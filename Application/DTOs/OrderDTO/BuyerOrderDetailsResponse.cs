using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class BuyerOrderDetailsResponse
    {
        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public List<string> Tags { get; set; } = new();

        public List<string> Medias { get; set; } = new();

        public string ProductTitle { get; set; }

        public string ProductDescription { get; set; }

        public decimal Price { get; set; }

        // Sotuvchi
        public int SellerId { get; set; }

        public string SellerName { get; set; }

        public string SellerPhone { get; set; }

        // Buyurtma
        public OrderStatus Status { get; set; }

        // To'lov
        public PaymentStatus PaymentStatus { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public DateTime CreatedAt { get; set; }

        // UI Actions
        public bool CanConfirmOrder { get; set; }

        public bool CanCancelOrder { get; set; }

        public bool CanOpenChat { get; set; }

        public bool CanOpenDispute { get; set; }
    }
}
