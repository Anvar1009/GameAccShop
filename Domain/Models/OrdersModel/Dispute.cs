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

        public string? AdminComment { get; set; }

        public DateTime? ResolvedAt { get; set; }

        public string Reason { get; set; } = string.Empty;

        public DisputeStatus Status { get; set; } = DisputeStatus.Open;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }


}
