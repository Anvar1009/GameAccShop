using Application.DTOs.AdminDTO;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Domain.Models.ProductsModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AdminStatsService : IAdminStatsService
    {
        private readonly IUserRepositories _userRepository;
        private readonly IProductRepository _productRepository;

        public AdminStatsService(IUserRepositories userRepository, IProductRepository productRepository)
        {
            _userRepository = userRepository;
            _productRepository = productRepository;
        }

        private const int RegistrationTrendDays = 30;

        public async Task<AdminStatsResponse> GetStatsAsync()
        {
            var totalUsers = await _userRepository.CountAsync();
            var productStatusCounts = await _productRepository.GetStatusCountsAsync();

            int CountOf(ProductStatus status) =>
                productStatusCounts.TryGetValue(status, out var count) ? count : 0;

            var fromDate = DateTime.UtcNow.Date.AddDays(-(RegistrationTrendDays - 1));
            var registrationCounts = await _userRepository.GetRegistrationCountsByDayAsync(fromDate);

            var registrationTrend = new List<RegistrationTrendPoint>();
            for (var day = fromDate; day <= DateTime.UtcNow.Date; day = day.AddDays(1))
            {
                registrationTrend.Add(new RegistrationTrendPoint
                {
                    Date = day,
                    Count = registrationCounts.TryGetValue(day, out var count) ? count : 0
                });
            }

            return new AdminStatsResponse
            {
                TotalUsers = totalUsers,
                TotalProducts = productStatusCounts.Values.Sum(),
                ActiveProducts = CountOf(ProductStatus.Active),
                ReservedProducts = CountOf(ProductStatus.Reserved),
                SoldProducts = CountOf(ProductStatus.Sold),
                DeletedProducts = CountOf(ProductStatus.Deleted),
                UserRegistrationTrend = registrationTrend
            };
        }
    }
}
