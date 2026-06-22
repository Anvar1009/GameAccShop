using Application.DTOs.ProductDTOs;
using Application.Interfaces.ServiceInterface;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        public Task<GetProductDTO> CreateAsync(CreateProductDTO product)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<GetProductDTO>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<GetProductDTO?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<GetProductDTO>> SearchByTagAsync(string tag)
        {
            throw new NotImplementedException();
        }

        public Task<GetProductDTO> UpdateAsync(UpdateProductDTO product)
        {
            throw new NotImplementedException();
        }
    }
}
