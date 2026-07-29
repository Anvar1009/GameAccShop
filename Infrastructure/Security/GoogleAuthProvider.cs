using Application.Exceptions;
using Application.Interfaces.Provider;
using Google.Apis.Auth;
using Infrastructure.Common;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class GoogleAuthProvider : IGoogleAuthProvider
    {
        private readonly GoogleSettings _settings;

        public GoogleAuthProvider(IOptions<GoogleSettings> options)
        {
            _settings = options.Value;
        }

        public async Task<GoogleUserInfo> ValidateAsync(string idToken)
        {
            GoogleJsonWebSignature.Payload payload;

            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(
                    idToken,
                    new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[] { _settings.ClientId }
                    });
            }
            catch (InvalidJwtException)
            {
                throw new InvalidGoogleTokenException();
            }

            return new GoogleUserInfo
            {
                Email = payload.Email,
                FirstName = string.IsNullOrWhiteSpace(payload.GivenName) ? "Google" : payload.GivenName,
                LastName = payload.FamilyName ?? string.Empty
            };
        }
    }
}
