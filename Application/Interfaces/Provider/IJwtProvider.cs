using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Provider
{
    public interface IJwtProvider
    {
        public string GenerateToken(User user);
    }
}
