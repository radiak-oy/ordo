namespace Ordo.Api.Mail;

public readonly record struct MailRequest
{
    public string ToEmail { get; init; }
    public string Subject { get; init; }
    public string Body { get; init; }
    public List<IFormFile> Attachments { get; init; }
}
