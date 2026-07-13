using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class ConversationNotFoundException:Exception
    {
        public ConversationNotFoundException(): base("Conversation not found")
        {
            
        }
    }
}
