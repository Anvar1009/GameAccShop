using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class SellerOrderResponse
    {
        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public string ProductImage { get; set; }

        public string ProductTitle { get; set; }

        public decimal Price { get; set; }

        // Buyer
        public int BuyerId { get; set; }

        public string BuyerName { get; set; }

        // Order
        public OrderStatus Status { get; set; }

        // Payment
        public PaymentStatus PaymentStatus { get; set; }

        public DateTime CreatedAt { get; set; }

        // Frontend Actions
        public bool CanOpenChat { get; set; }

        public bool CanOpenDispute { get; set; }
    }
}
