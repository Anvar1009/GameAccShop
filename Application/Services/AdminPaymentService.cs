using Application.DTOs.PaymentDTO;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AdminPaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IOrderRepository _orderRepository;
        public AdminPaymentService(IPaymentRepository paymentRepository, IOrderRepository orderRepository)
        {
            _paymentRepository = paymentRepository;
            _orderRepository = orderRepository;
        }

        public async Task<PaymentDetailsResponse> GetPaymentDetailsAsync(int buyerId, int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) 
            {
                throw new ArgumentNullException(nameof(order));
            }

            var payment = order.Payment;

            if(payment == null)
            {
                throw new ArgumentNullException(nameof(payment));
            }

            return new PaymentDetailsResponse 
            {
                Amount = payment.Amount,
                CardNumber = payment.PaymentAccount.AccountNumber,
                Name = payment.PaymentAccount.Name,
                OwnerName = payment.PaymentAccount.OwnerName,
                PaymentMethod = payment.PaymentMethod,
                OrderId = orderId,
                PaymentId = payment.Id,
                Status= payment.Status
            };

        }


        public Task<PaymentStatusResponse> GetPaymentStatusAsync(int buyerId, int orderId)
        {
            throw new NotImplementedException();
        }

        public Task UploadReceiptAsync(int buyerId, UploadReceiptRequest request)
        {
            throw new NotImplementedException();
        }


        //  Admin Payment Service Methods

        public Task<AdminPaymentDetailsResponse> GetPaymentDetailsAsync(int paymentId)
        {
            throw new NotImplementedException();
        }

        public Task<List<AdminPaymentResponse>> GetPaymentsAsync()
        {
            throw new NotImplementedException();
        }

        
        public Task ReleasePaymentAsync(int paymentId)
        {
            throw new NotImplementedException();
        }

        public Task ConfirmPaymentAsync(int paymentId)
        {
            throw new NotImplementedException();
        }

    }
}
