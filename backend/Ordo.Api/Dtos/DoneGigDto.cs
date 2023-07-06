using Ordo.Api.Models;

namespace Ordo.Api.Dtos;

public readonly record struct DoneGigDto
{
    public Guid Id { get; init; }
    public string Qualification { get; init; }
    public DateTimeOffset Start { get; init; }
    public DateTimeOffset End { get; init; }
    public string Address { get; init; }
    public string Description { get; init; }

    public static DoneGigDto FromModel(Gig gig) => new DoneGigDto
    {
        Id = gig.Id,
        Qualification = gig.Qualification.Name,
        Start = gig.Start,
        End = gig.End,
        Address = gig.Address,
        Description = gig.Description
    };
}