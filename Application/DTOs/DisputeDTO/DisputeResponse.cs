using Domain.Models.OrdersModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.DisputeDTO
{
    public class DisputeResponse
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public int ProductId { get; set; }

        public string ProductDescription { get; set; } = string.Empty;

        public int BuyerId { get; set; }

        public string BuyerName { get; set; } = string.Empty;

        public int SellerId { get; set; }

        public string SellerName { get; set; } = string.Empty;

        public int OpenedById { get; set; }

        public string OpenedByName { get; set; } = string.Empty;

        public string Reason { get; set; } = string.Empty;

        public string? AdminComment { get; set; }

        public DisputeStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? ResolvedAt { get; set; }
    }
}
