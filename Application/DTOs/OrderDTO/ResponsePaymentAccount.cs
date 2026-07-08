using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.OrderDTO
{
    public class ResponsePaymentAccount
    {
        public int Id { get; set; }

        public string Name { get; set; }          // Asaka Card, Click, Payme
        public string OwnerName { get; set; }         // FIO

        public PaymentMethod Method { get; set; }

        public string AccountNumber { get; set; } // Karta yoki Merchant ID

        public bool IsActive { get; set; }
    }
}
