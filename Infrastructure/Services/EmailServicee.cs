using Application.Interfaces;
using Application.Interfaces.ServiceInterface;
using Infrastructure.Common;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

public class EmailServicee : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailServicee(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendVerificationCodeAsync(string email, string code)
    {
        var message = new MimeMessage();

        message.From.Add(
            new MailboxAddress(
                _settings.SenderName,
                _settings.SenderEmail));

        message.To.Add(
            MailboxAddress.Parse(email));

        message.Subject = "Email Verification";

        message.Body = new TextPart("plain")
        {
            Text = $"""
                    Your verification code is:

                    {code}

                    This code expires in 5 minutes.
                    """
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            _settings.Host,
            _settings.Port,
            SecureSocketOptions.StartTls);

        await smtp.AuthenticateAsync(
            _settings.SenderEmail,
            _settings.Password);

        await smtp.SendAsync(message);

        await smtp.DisconnectAsync(true);
    }
}