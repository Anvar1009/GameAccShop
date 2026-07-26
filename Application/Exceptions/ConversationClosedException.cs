using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class ConversationClosedException:Exception
    {
        public ConversationClosedException(): base("This conversation is closed.")
        {

        }
    }
}
