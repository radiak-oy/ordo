using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Ordo.Api.Options;
using Microsoft.Extensions.Options;

namespace Ordo.Api.Mail;

public class MailService : IMailService
{
    private readonly MailOptions _options;
    private readonly ILogger _logger;

    public MailService(IOptions<MailOptions> options, ILogger<MailService> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(MailRequest mailRequest)
    {
        var email = new MimeMessage
        {
            Sender = MailboxAddress.Parse(_options.Address),
            Subject = mailRequest.Subject,
        };

        email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));

        var builder = new BodyBuilder
        {
            HtmlBody = mailRequest.Body
        };

        if (mailRequest.Attachments != null)
        {
            byte[] fileBytes;
            foreach (var file in mailRequest.Attachments)
            {
                if (file.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        fileBytes = ms.ToArray();
                    }

                    builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                }
            }
        }

        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(_options.Host, _options.Port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_options.Address, _options.Password);

        await smtp.SendAsync(email);

        await smtp.DisconnectAsync(true);

        _logger.LogInformation("Sent an email to {email}.", mailRequest.ToEmail);
    }
}