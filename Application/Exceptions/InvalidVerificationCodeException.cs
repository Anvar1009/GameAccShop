using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Exceptions
{
    public class InvalidVerificationCodeException : Exception
    {
        public InvalidVerificationCodeException()
        : base("Tasdiqlash kodi noto'g'ri yoki muddati o'tgan")
        {
        }
    }
}
