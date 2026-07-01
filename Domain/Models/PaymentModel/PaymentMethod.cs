using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.PaymentModel
{
    public enum PaymentMethod
    {
        CardTransfer = 1,
        Click = 2,
        Payme = 3,
        UzumBank = 4,
        Stripe = 5
    }
}
