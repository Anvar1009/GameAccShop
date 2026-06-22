using Application.DTOs.ProductDTOs;
using Application.Interfaces.ServiceInterface;
using Domain.Models.ProductsModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        public Task<GetProductDTO> CreateAsync(CreateProductDTO product)
        {

            var list = product.Tags.ToList();
            ICollection<ProductTag> productTags = new HashSet<ProductTag>();

            foreach (var tag in list)
            {
                ProductTag productTag = new ProductTag()
                {
                    Name = tag
                };
                productTags.Add(productTag);
            }


            Product product1 = new Product()
            {
                AccStrength = product.AccStrength,
                AccPrice = product.AccPrice,
                CoinsCount = product.CoinsCount,
                PlayerCount = product.PlayerCount,
                Description = product.Description,
                AccEmail = product.AccEmail,
                AccPasswordHash = product.AccPassword,
                Status = ProductStatus.Available,
                CreatedAt = DateTime.Now,
                Tags=productTags,

            };

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
