using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class ForbiddenException:Exception
    {
        public ForbiddenException() : base("Siz ushbu mahsulotni tahrirlash huquqiga ega emassiz.")
        {
            
        }
    }
}
