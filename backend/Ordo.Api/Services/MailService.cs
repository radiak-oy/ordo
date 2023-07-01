using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Ordo.Api.Mail;
using Ordo.Api.Options;
using Microsoft.Extensions.Options;

namespace Ordo.Api.Services;

public class MailService : IMailService
{
    private readonly MailOptions _options;

    public MailService(IOptions<MailOptions> options)
    {
        _options = options.Value;
    }

    public async Task SendEmailAsync(MailRequest mailRequest)
    {
        var email = new MimeMessage();

        email.Sender = MailboxAddress.Parse(_options.Address);
        email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
        email.Subject = mailRequest.Subject;

        var builder = new BodyBuilder();

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

        builder.HtmlBody = mailRequest.Body;
        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(_options.Host, _options.Port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_options.Address, _options.Password);

        await smtp.SendAsync(email);

        smtp.Disconnect(true);
    }
}