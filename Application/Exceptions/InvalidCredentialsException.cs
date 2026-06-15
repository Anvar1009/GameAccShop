using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Exceptions
{
    public class InvalidCredentialsException:Exception
    {
        public InvalidCredentialsException()
         : base("Login yoki parol noto'g'ri")
        {
        }
    }
}
