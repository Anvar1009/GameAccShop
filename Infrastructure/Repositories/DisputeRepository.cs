using Application.Interfaces.Repositories_interface;
using Domain.Models.OrdersModel;
using Infrastructure.EntityModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class DisputeRepository : IDisputeRepository
    {
        private readonly DbContextModel _context;
        public DisputeRepository(DbContextModel dbContextModel)
        {
            _context = dbContextModel;
        }

        private static readonly DisputeStatus[] OpenStatuses =
        {
            DisputeStatus.Open,
            DisputeStatus.UnderReview,
            DisputeStatus.WaitingEvidence
        };

        public async Task CreateAsync(Dispute dispute)
        {
            await _context.Disputes.AddAsync(dispute);
            await _context.SaveChangesAsync();
        }

        public async Task<Dispute?> GetByIdAsync(int id)
        {
            var dispute = await _context.Disputes.AsNoTracking()
                                       .Include(d => d.Order).ThenInclude(o => o.Buyer)
                                       .Include(d => d.Order).ThenInclude(o => o.Seller)
                                       .Include(d => d.Order).ThenInclude(o => o.Product)
                                       .Include(d => d.OpenedBy)
                                       .Include(d => d.Evidence).ThenInclude(e => e.UploadedBy)
                                       .FirstOrDefaultAsync(d => d.Id == id);
            return dispute;
        }

        public async Task<Dispute?> GetByOrderIdAsync(int orderId)
        {
            var dispute = await _context.Disputes.AsNoTracking()
                                       .Include(d => d.Order).ThenInclude(o => o.Buyer)
                                       .Include(d => d.Order).ThenInclude(o => o.Seller)
                                       .Include(d => d.Order).ThenInclude(o => o.Product)
                                       .Include(d => d.OpenedBy)
                                       .Include(d => d.Evidence).ThenInclude(e => e.UploadedBy)
                                       .Where(d => d.OrderId == orderId)
                                       .OrderByDescending(d => d.CreatedAt)
                                       .FirstOrDefaultAsync();
            return dispute;
        }

        public async Task<List<Dispute>> GetAllAsync()
        {
            var disputes = await _context.Disputes.AsNoTracking()
                                       .Include(d => d.Order).ThenInclude(o => o.Buyer)
                                       .Include(d => d.Order).ThenInclude(o => o.Seller)
                                       .Include(d => d.Order).ThenInclude(o => o.Product)
                                       .Include(d => d.OpenedBy)
                                       .OrderByDescending(d => d.CreatedAt)
                                       .ToListAsync();
            return disputes;
        }

        public async Task<List<Dispute>> GetByUserIdAsync(int userId)
        {
            var disputes = await _context.Disputes.AsNoTracking()
                                       .Where(d => d.OpenedById == userId ||
                                                   d.Order.BuyerId == userId ||
                                                   d.Order.SellerId == userId)
                                       .Include(d => d.Order).ThenInclude(o => o.Buyer)
                                       .Include(d => d.Order).ThenInclude(o => o.Seller)
                                       .Include(d => d.Order).ThenInclude(o => o.Product)
                                       .Include(d => d.OpenedBy)
                                       .OrderByDescending(d => d.CreatedAt)
                                       .ToListAsync();
            return disputes;
        }

        public async Task UpdateAsync(Dispute dispute)
        {
            // Entry(...).State avoids DbSet.Update's whole-graph attach: the
            // caller's dispute always has OpenedBy loaded alongside Order (with
            // Buyer/Seller), and OpenedBy is always one of those two — attaching
            // the full graph would track the same User row twice and EF throws.
            _context.Entry(dispute).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsOpenDisputeAsync(int orderId)
        {
            return await _context.Disputes.AsNoTracking()
                                       .AnyAsync(d => d.OrderId == orderId && OpenStatuses.Contains(d.Status));
        }

        public async Task AddEvidenceAsync(DisputeEvidence evidence)
        {
            await _context.DisputeEvidences.AddAsync(evidence);
            await _context.SaveChangesAsync();
        }
    }
}
