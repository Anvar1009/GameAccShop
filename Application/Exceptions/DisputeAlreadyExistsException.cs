using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class DisputeAlreadyExistsException:Exception
    {
        public DisputeAlreadyExistsException(): base("An active dispute already exists for this order.")
        {

        }
    }
}
