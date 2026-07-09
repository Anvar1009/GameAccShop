using Application.DTOs.PaymentDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.ServiceInterface
{
    public interface IPaymentService
    {
        Task<PaymentDetailsResponse> GetBuyerPaymentDetailsAsync(int buyerId, int orderId);
        Task UploadReceiptAsync(int buyerId, UploadReceiptRequest request);
        Task<PaymentStatusResponse> GetPaymentStatusAsync(int buyerId, int orderId);


        //  for admin
        Task<List<AdminPaymentResponse>> GetPaymentsAsync();
        Task<AdminPaymentDetailsResponse> GetPaymentDetailsAsync(int paymentId);
        Task ConfirmPaymentAsync(int paymentId);
        Task ReleasePaymentAsync(int paymentId);
    }
}
