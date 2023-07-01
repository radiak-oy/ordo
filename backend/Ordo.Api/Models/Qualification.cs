namespace Ordo.Api.Models;

public class Qualification
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public ICollection<Worker> Workers { get; set; } = null!;
}