using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.OrdersModel
{
    public class Dispute
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        // Buyer yoki Seller
        public int OpenedById { get; set; }
        public User OpenedBy { get; set; }

        public string Reason { get; set; }

        public string? AdminComment { get; set; }

        public DisputeStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? ResolvedAt { get; set; }
    }
}
