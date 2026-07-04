using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.PaymentDTO
{
    public class AdminPaymentResponse
    {
        public int PaymentId { get; set; }

        public int OrderId { get; set; }

        public string BuyerName { get; set; }

        public string SellerName { get; set; }

        public decimal Amount { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

        public PaymentStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
