using Domain.Models.OrdersModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class AdminOrderResponse
    {
        public int OrderId { get; set; }

        public decimal Price { get; set; }

        public OrderStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public int BuyerId { get; set; }

        public string BuyerName { get; set; } = string.Empty;

        public int SellerId { get; set; }

        public string SellerName { get; set; } = string.Empty;

        public int ProductId { get; set; }
    }
}
