using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.ChatModels
{
    public enum NotificationType
    {
        NewOrder,

        PaymentUploaded,

        PaymentConfirmed,

        BuyerConfirmed,

        PaymentReleased,

        DisputeOpened,

        DisputeUnderReview,

        DisputeEvidenceRequested,

        DisputeResolved,

        DisputeClosed
    }
}
