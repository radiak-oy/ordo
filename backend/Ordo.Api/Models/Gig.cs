namespace Ordo.Api.Models;

public class Gig
{
    public Guid Id { get; set; }
    public Qualification Qualification { get; set; } = null!;
    public DateTimeOffset Start { get; set; }
    public DateTimeOffset End { get; set; }
    public string Address { get; set; } = null!;
    public int MaxWorkers { get; set; }
    public List<string> WorkerIds { get; set; } = null!;
}
