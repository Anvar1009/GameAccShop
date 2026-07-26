using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.DisputeDTO
{
    public class UploadDisputeEvidenceRequest
    {
        public List<IFormFile> Files { get; set; } = new();
    }
}
