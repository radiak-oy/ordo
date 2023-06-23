namespace Ordo.Api.Dtos;

public readonly record struct DoneGigDto
{
    public Guid Id { get; init; }
    public string Qualification { get; init; }
    public DateTimeOffset Start { get; init; }
    public DateTimeOffset End { get; init; }
    public string Address { get; init; }
}