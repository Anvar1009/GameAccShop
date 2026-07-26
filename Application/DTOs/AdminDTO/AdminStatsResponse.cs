using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.AdminDTO
{
    public class AdminStatsResponse
    {
        public int TotalUsers { get; set; }

        public int TotalProducts { get; set; }

        public int ActiveProducts { get; set; }

        public int ReservedProducts { get; set; }

        public int SoldProducts { get; set; }

        public int DeletedProducts { get; set; }

        public List<RegistrationTrendPoint> UserRegistrationTrend { get; set; } = new();
    }
}
