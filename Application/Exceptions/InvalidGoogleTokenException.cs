using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Exceptions
{
    public class InvalidGoogleTokenException : Exception
    {
        public InvalidGoogleTokenException()
        : base("Google token yaroqsiz")
        {
        }
    }
}
