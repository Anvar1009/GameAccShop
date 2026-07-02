using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class OrderResponse
    {
        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public decimal Price { get; set; }

        public OrderStatus Status { get; set; }

        public PaymentStatus PaymentStatus { get; set; }

        public bool PaymentRequired { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
