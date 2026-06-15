using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Exceptions
{
    public class LoginAlreadyExistsException:Exception
    {
        public LoginAlreadyExistsException()
        : base("Bu login allaqachon mavjud")
        {
        }
    }
}
