namespace Ordo.Api.Dtos;

public readonly record struct UpcomingGigDto
{
    public Guid Id { get; init; }
    public string Qualification { get; init; }
    public DateTimeOffset Start { get; init; }
    public DateTimeOffset End { get; init; }
    public string Address { get; init; }
    public bool IsSignedUp { get; init; }
}