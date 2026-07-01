using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.PaymentModel
{
    public class PaymentAccount
    {
        public int Id { get; set; }

        public string Name { get; set; }          // Asaka Card, Click, Payme

        public PaymentMethod Method { get; set; }

        public string AccountNumber { get; set; } // Karta yoki Merchant ID

        public bool IsActive { get; set; }
    }
}
