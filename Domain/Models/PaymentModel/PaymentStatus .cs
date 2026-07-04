using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.PaymentModel
{
    public enum PaymentStatus
    {
        Pending,
        Confirmed,
        Released,
        Cancelled
    }
}
