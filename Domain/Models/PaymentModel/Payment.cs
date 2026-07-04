using Domain.Models.OrdersModel;
using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.PaymentModel
{
    public class Payment
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        // To'lov summasi
        public decimal Amount { get; set; }
        public string? ReceiptUrl { get; set; }

        // Manual, Click, Payme...
        public PaymentMethod PaymentMethod { get; set; }

        // Pending, Confirmed, Released...
        public PaymentStatus Status { get; set; }

        public int PaymentAccountId { get; set; }
        public PaymentAccount PaymentAccount { get; set; }

        // Admin tasdiqlaganmi
        public int? ConfirmedByAdminId { get; set; }
        public User? ConfirmedByAdmin { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public DateTime? ReleasedAt { get; set; }
    }
}
