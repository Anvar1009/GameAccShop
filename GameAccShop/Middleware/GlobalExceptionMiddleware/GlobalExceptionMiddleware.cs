using Application.DTOs;
using Application.Exceptions;

namespace GameAccShop.Middleware.GlobalExceptionMiddleware
{
    public class GlobalExceptionMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch(Exception ex) 
            {
                await HandleExceptionAsync(context, ex);
            }

        }
        private async Task HandleExceptionAsync(
    HttpContext context,
    Exception ex)
        {

            context.Response.ContentType = "application/json";

            ErrorResponseDTO response = new();

            if (ex is InvalidCredentialsException)
            {
                context.Response.StatusCode = 401;

                response.StatusCode = 401;
                response.Message = ex.Message;
            }
            else if (ex is LoginAlreadyExistsException)
            {
                context.Response.StatusCode = 400;

                response.StatusCode = 400;
                response.Message = ex.Message;
            }
            else if (ex is UserNotFoundException)
            {
                context.Response.StatusCode = 404;

                response.StatusCode = 404;
                response.Message = ex.Message;
            }
            else if (ex is ProductNotFoundException)
            {
                context.Response.StatusCode = 404;

                response.StatusCode = 404;
                response.Message = ex.Message;
            }
            else if (ex is BadRequestException)
            {
                context.Response.StatusCode = 400;

                response.StatusCode = 400;
                response.Message = ex.Message;
            }
            else if (ex is Application.DTOs.OrderDTO.OrderNotFoundException)
            {
                context.Response.StatusCode = 404;

                response.StatusCode = 404;
                response.Message = ex.Message;
            }
            else if (ex is PaymentNotFoundException)
            {
                context.Response.StatusCode = 404;

                response.StatusCode = 404;
                response.Message = ex.Message;
            }
            else if (ex is DisputeNotFoundException)
            {
                context.Response.StatusCode = 404;

                response.StatusCode = 404;
                response.Message = ex.Message;
            }
            else if (ex is DisputeAlreadyExistsException)
            {
                context.Response.StatusCode = 400;

                response.StatusCode = 400;
                response.Message = ex.Message;
            }
            else if (ex is ForbiddenException)
            {
                context.Response.StatusCode = 403;

                response.StatusCode = 403;
                response.Message = ex.Message;
            }
            else if (ex is ConversationNotFoundException)
            {
                context.Response.StatusCode = 404;

                response.StatusCode = 404;
                response.Message = ex.Message;
            }
            else if (ex is ConversationClosedException)
            {
                context.Response.StatusCode = 400;

                response.StatusCode = 400;
                response.Message = ex.Message;
            }
            else if (ex is InvalidVerificationCodeException)
            {
                context.Response.StatusCode = 400;

                response.StatusCode = 400;
                response.Message = ex.Message;
            }
            else if (ex is EmailNotVerifiedException)
            {
                context.Response.StatusCode = 403;

                response.StatusCode = 403;
                response.Message = ex.Message;
            }
            else if (ex is InvalidGoogleTokenException)
            {
                context.Response.StatusCode = 400;

                response.StatusCode = 400;
                response.Message = ex.Message;
            }
            else if (ex is ProductHasPaidOrderException)
            {
                context.Response.StatusCode = 400;

                response.StatusCode = 400;
                response.Message = ex.Message;
            }
            else
            {
                context.Response.StatusCode = 500;

                response.StatusCode = 500;
                response.Message = ex.Message;
            }

            var json = System.Text.Json.JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }
}
