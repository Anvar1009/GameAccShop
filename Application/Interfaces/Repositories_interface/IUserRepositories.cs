using Application.DTOs.RegisterDTO;
using Domain.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Repositories_interface
{
    public interface IUserRepositories
    {
        public Task<User> Register(User user);
        public Task<User> GetByLoginAsycn(string login);
        public Task<User> GetUserByIdAsync(int userId);

        /// <summary>
        /// Admin va Super_Aamin rolidagi foydalanuvchilar — to'lov oqimidagi
        /// bildirishnomalar shularga yuboriladi.
        /// </summary>
        public Task<List<User>> GetAdminsAsync();

        public Task<int> CountAsync();

        /// <summary>Registrations per calendar day (UTC), for users created on or after <paramref name="fromDateUtc"/>.</summary>
        public Task<Dictionary<DateTime, int>> GetRegistrationCountsByDayAsync(DateTime fromDateUtc);

    }
}
