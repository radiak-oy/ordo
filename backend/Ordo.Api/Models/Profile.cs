namespace Ordo.Api.Models;

public class Profile
{
    public string WorkerId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public List<Qualification> Qualifications { get; set; } = null!;
    public string Notes { get; set; } = null!;
}