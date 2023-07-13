namespace Ordo.Api.Mail;

public interface IMailService
{
    public Task SendEmailAsync(MailRequest mailRequest);
}