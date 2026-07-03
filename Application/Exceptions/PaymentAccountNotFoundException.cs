using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class PaymentAccountNotFoundException:Exception
    {
        public PaymentAccountNotFoundException()
            : base( "Payment account not found.")
        {
            
        }
    }
}
