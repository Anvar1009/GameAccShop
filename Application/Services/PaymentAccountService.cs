using Application.DTOs.OrderDTO;
using Application.Exceptions;
using Application.Interfaces.Repositories_interface;
using Application.Interfaces.ServiceInterface;
using Domain.Models.PaymentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class PaymentAccountService : IPaymentAccountService
    {
        private readonly IPaymentAccountRepository _repository;
        public PaymentAccountService(IPaymentAccountRepository paymentAccountRepository)
        {
            _repository = paymentAccountRepository;
        }
        public async Task CreateAsync(CreateRequestPaymentAccount request)
        {
            if(request == null)
            {
                throw new BadRequestException(nameof(request));
            }

            PaymentAccount paymentAccount = new PaymentAccount
            {
                Name = request.Name,
                OwnerName = request.OwnerName,
                Method = request.Method,
                AccountNumber = request.AccountNumber,
                IsActive = true
            };

            await _repository.CreateAsync(paymentAccount);
        }

        public async Task DeleteAsync(int PayAccountId)
        {
            if (PayAccountId <= 0)
            {
                throw new BadRequestException(nameof(PayAccountId));
            }

            var paymentAccount = await _repository.GetByIdAsync(PayAccountId);
            if (paymentAccount == null)
            {
                throw new PaymentAccountNotFoundException();
            }

            await _repository.DeleteAsync(paymentAccount);
        }

        public async Task<ResponsePaymentAccount?> GetActiveAsync()
        {
            var activePaymentAccount = await _repository.GetActiveAsync();

            if(activePaymentAccount == null)
            {
                throw new PaymentAccountNotFoundException();
            }

            return new ResponsePaymentAccount
            {
                Id = activePaymentAccount.Id,
                Name = activePaymentAccount.Name,
                OwnerName = activePaymentAccount.OwnerName,
                Method = activePaymentAccount.Method,
                AccountNumber = activePaymentAccount.AccountNumber,
                IsActive = activePaymentAccount.IsActive
            };
        }

        public async Task<ResponsePaymentAccount?> GetByIdAsync(int PayAccountId)
        {
            var paymentAccount = await _repository.GetByIdAsync(PayAccountId);

            if(paymentAccount == null)
            {
                throw new PaymentAccountNotFoundException();
            }

            return new ResponsePaymentAccount
            {
                Id = paymentAccount.Id,
                Name = paymentAccount.Name,
                OwnerName = paymentAccount.OwnerName,
                Method = paymentAccount.Method,
                AccountNumber = paymentAccount.AccountNumber,
                IsActive = paymentAccount.IsActive
            };
        }

        public async Task UpdateAsync(int PayAccountId, CreateRequestPaymentAccount request)
        {
            if(request == null || PayAccountId <= 0)
            {
                throw new BadRequestException(nameof(request));
            }

            var paymentAccount = await _repository.GetByIdAsync(PayAccountId);

            if (paymentAccount == null)
            {
                throw new PaymentAccountNotFoundException();
            }


            paymentAccount.Name = request.Name;
            paymentAccount.OwnerName = request.OwnerName;
            paymentAccount.Method = request.Method;
            paymentAccount.AccountNumber = request.AccountNumber;
            paymentAccount.IsActive = true;
            paymentAccount.Id = PayAccountId;

            await _repository.UpdateAsync(paymentAccount);
        }
    }
}
