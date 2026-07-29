using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Exceptions
{
    public class EmailNotVerifiedException : Exception
    {
        public EmailNotVerifiedException()
        : base("Email tasdiqlanmagan. Iltimos, emailingizga yuborilgan kodni kiriting")
        {
        }
    }
}
