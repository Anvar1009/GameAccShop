using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.OrdersModel
{
    public enum DisputeStatus
    {
        Open = 1,              // Buyer yoki Seller dispute ochdi

        UnderReview = 2,       // Admin ko'rib chiqmoqda

        WaitingEvidence = 3,   // Qo'shimcha isbot kutilmoqda

        ResolvedBuyer = 4,     // Buyer foydasiga hal qilindi

        ResolvedSeller = 5,    // Seller foydasiga hal qilindi

        Closed = 6             // Dispute yopildi
    }
}
