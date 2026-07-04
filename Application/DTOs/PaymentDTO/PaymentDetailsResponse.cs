using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.PaymentDTO
{
    public class PaymentDetailsResponse
    {
        public int PaymentId { get; set; }

        public int OrderId { get; set; }

        // Payment Account
        public string Name { get; set; }          // Asaka, Humo, Click...
        public string OwnerName { get; set; }
        public string CardNumber { get; set; }

        // Payment
        public decimal Amount { get; set; }

        public PaymentStatus Status { get; set; }

        public PaymentMethod PaymentMethod { get; set; }

    }
}
