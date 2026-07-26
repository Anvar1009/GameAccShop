using Application.DTOs.DisputeDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface IDisputeService
    {
        // ── Buyer / Seller ───────────────────────────────────────────────
        Task<DisputeResponse> OpenDisputeAsync(int userId, OpenDisputeRequest request);

        Task<List<DisputeListResponse>> GetMyDisputesAsync(int userId);

        Task<DisputeResponse> GetDisputeByIdAsync(int disputeId, int userId, bool isAdmin);

        // ── Admin ────────────────────────────────────────────────────────
        Task<List<DisputeListResponse>> GetAllDisputesAsync();

        Task StartReviewAsync(int disputeId);

        Task RequestEvidenceAsync(int disputeId);

        Task ResolveBuyerAsync(int disputeId, ResolveDisputeRequest request);

        Task ResolveSellerAsync(int disputeId, ResolveDisputeRequest request);

        Task CloseAsync(int disputeId);
    }
}
