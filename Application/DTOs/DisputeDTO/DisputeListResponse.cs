using Domain.Models.OrdersModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.DisputeDTO
{
    public class DisputeListResponse
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int OpenedById { get; set; }

        public string OpenedByName { get; set; } = string.Empty;

        public string Reason { get; set; } = string.Empty;

        public DisputeStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
