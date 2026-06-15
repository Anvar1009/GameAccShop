using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Exceptions
{
    public class UserNotFoundException:Exception
    {
        public UserNotFoundException()
        : base("Bunday foydalanuvchi mavjud emas")
        {
        }
    }
}
