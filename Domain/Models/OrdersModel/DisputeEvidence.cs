using Domain.Models.Abstracts;
using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.OrdersModel
{
    public class DisputeEvidence
    {
        public int Id { get; set; }

        public int DisputeId { get; set; }
        public Dispute Dispute { get; set; }

        // Buyer yoki Seller — kim yukladi
        public int UploadedById { get; set; }
        public User UploadedBy { get; set; }

        public string Url { get; set; }

        public MediaType Type { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
