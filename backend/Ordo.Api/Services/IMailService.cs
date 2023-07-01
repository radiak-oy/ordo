using Ordo.Api.Mail;

namespace Ordo.Api.Services;

public interface IMailService
{
    Task SendEmailAsync(MailRequest mailRequest);
}