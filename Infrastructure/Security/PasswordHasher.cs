using Application.Interfaces.Security;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Security
{
    public class PasswordHasher : IPasswordHasher
    {
        /// <summary>
        /// Generate hash for password 
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public string HashPassword(string password)
        {
            return  BCrypt.Net.BCrypt.HashPassword(password);
             
        }
        /// <summary>
        /// Verify password and HashPassword
        /// </summary>
        /// <param name="password"></param>
        /// <param name="HashPassword"></param>
        /// <returns></returns>
        public bool VerifyPassword(string password, string HashPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, HashPassword);
        }
    }
}
