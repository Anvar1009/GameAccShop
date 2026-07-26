using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class DisputeNotFoundException:Exception
    {
        public DisputeNotFoundException(): base("Dispute not found.")
        {

        }
    }
}
