using Domain.Models.OrdersModel;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.PaymentDTO
{
    public class PaymentStatusResponse
    {
        public int PaymentId { get; set; }

        public PaymentStatus Status { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public DateTime? ReleasedAt { get; set; }
    }
}
