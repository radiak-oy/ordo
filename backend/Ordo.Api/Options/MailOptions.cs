namespace Ordo.Api.Options;

public class MailOptions
{
    public readonly static string Mail = "Mail";

    public string Address { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Host { get; set; } = null!;
    public int Port { get; set; }
}
