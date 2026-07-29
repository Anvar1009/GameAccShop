using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Provider
{
    public class GoogleUserInfo
    {
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }

    public interface IGoogleAuthProvider
    {
        public Task<GoogleUserInfo> ValidateAsync(string idToken);
    }
}
