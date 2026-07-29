using Application.DTOs.ProductDTOs;
using Domain.Models.ProductsModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.ServiceInterface
{
    public interface IProductService
    {
        Task<GetProductDTO> CreateAsync(CreateProductDTO product, int userId);

        Task<List<GetProductDTO>> GetAllAsync();

        Task<GetProductDTO?> GetByIdAsync(int id);

        Task<List<GetProductDTO>> SearchByTagAsync(string tag);

        Task<GetProductDTO> UpdateAsync(UpdateProductDTO product);

        Task DeleteAsync(int id, int sellerId);

        Task<List<GetProductDTO>> GetSellerProductsAsync(int sellerId);

        Task<GetProductDTO> GetSellerProductDetailsAsync(int sellerId, int productId);
    }
}
