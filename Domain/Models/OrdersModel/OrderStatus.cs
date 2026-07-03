using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Models.OrdersModel
{
    public enum OrderStatus
    {
        WaitingPayment,

        PaymentConfirmed,

        TransferInProgress,

        BuyerConfirmed,

        Completed,

        Cancelled,

        Disputed
    }
}
