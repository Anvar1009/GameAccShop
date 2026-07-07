using Application.DTOs.ProductDTOs;
using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService product)
        {
            _productService = product;              
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(
        [FromForm] CreateProductDTO dto)
        {
            var userId = User.FindFirst(
            ClaimTypes.NameIdentifier);

            var sellerId = int.Parse(userId.Value);

            var result = await _productService.CreateAsync(dto, sellerId);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("id")]
        public async Task<IActionResult> GetByID(int id)
        {
            var result = await _productService.GetByIdAsync(id);    

            return Ok(result);
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _productService.GetAllAsync();

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteAsync(id);

            return Ok(id);

        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateAsync(UpdateProductDTO updateProductDTO)
        {
            var result = await _productService.UpdateAsync(updateProductDTO);   

            return Ok(result);  

        }



        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetSellerProducts()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var sellerId))
            {
                return Unauthorized();
            }
            var result = await _productService.GetSellerProductsAsync(sellerId);
            return Ok(result);
        }


        [HttpGet("details/{productId}")]
        [Authorize]
        public async Task<IActionResult> GetSellerProductDetails(int productId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userId == null || !int.TryParse(userId.Value, out var sellerId))
            {
                return Unauthorized();
            }
            var result = await _productService.GetSellerProductDetailsAsync(sellerId, productId);
            return Ok(result);
        }
    }
}
