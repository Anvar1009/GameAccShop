using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Security
{
    public interface IPasswordHasher
    {
        public string HashPassword(string password);
        public bool VerifyPassword(string password, string HashPassword);
    }
}
