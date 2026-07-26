using Domain.Models.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.DisputeDTO
{
    public class DisputeEvidenceResponse
    {
        public int Id { get; set; }

        public int UploadedById { get; set; }

        public string UploadedByName { get; set; } = string.Empty;

        public string Url { get; set; } = string.Empty;

        public MediaType Type { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
