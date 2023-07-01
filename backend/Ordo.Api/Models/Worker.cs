namespace Ordo.Api.Models;

public class Worker
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public List<Qualification> Qualifications { get; set; } = null!;
    public string Notes { get; set; } = null!;
}