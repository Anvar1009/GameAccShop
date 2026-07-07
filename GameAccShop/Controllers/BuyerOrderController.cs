using Application.Interfaces.ServiceInterface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameAccShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuyerOrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public BuyerOrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
    }
}
