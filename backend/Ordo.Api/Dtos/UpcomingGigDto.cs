using Ordo.Api.Models;

namespace Ordo.Api.Dtos;

public readonly record struct UpcomingGigDto
{
    public Guid Id { get; init; }
    public string Qualification { get; init; }
    public DateTimeOffset Start { get; init; }
    public DateTimeOffset End { get; init; }
    public string Address { get; init; }
    public bool IsSignedUp { get; init; }
    public string Description { get; init; }

    public static UpcomingGigDto FromModel(Gig gig, bool isSignedUp) => new UpcomingGigDto
    {
        Id = gig.Id,
        Qualification = gig.Qualification.Name,
        Start = gig.Start,
        End = gig.End,
        Address = gig.Address,
        IsSignedUp = isSignedUp,
        Description = gig.Description
    };
}