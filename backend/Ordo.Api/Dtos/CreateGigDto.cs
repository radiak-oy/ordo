namespace Ordo.Api.Dtos;

public readonly record struct CreateGigDto
{
    public string Type { get; init; }
    public DateTimeOffset Start { get; init; }
    public DateTimeOffset End { get; init; }
    public string Address { get; init; }
    public int MaxWorkers { get; init; }
}