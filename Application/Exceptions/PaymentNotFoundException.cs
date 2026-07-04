using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class PaymentNotFoundException:Exception
    {
        public PaymentNotFoundException(): base("Payment not found.")
        {
            
        }
    }
}
