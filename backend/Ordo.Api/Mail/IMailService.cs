namespace Ordo.Api.Mail;

public interface IMailService
{
    Task SendEmailAsync(MailRequest mailRequest);
}