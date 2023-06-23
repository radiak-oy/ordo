using Ordo.Api.Models;

namespace Ordo.Api.Dtos;

public readonly record struct GigDto
{
    public Guid Id { get; init; }
    public QualificationDto Qualification { get; init; }
    public DateTimeOffset Start { get; init; }
    public DateTimeOffset End { get; init; }
    public string Address { get; init; }
    public int MaxWorkers { get; init; }
    public string[] WorkerIds { get; init; }

    public static GigDto FromModel(Gig gig) => new GigDto
    {
        Id = gig.Id,
        Qualification = QualificationDto.FromModel(gig.Qualification),
        Start = gig.Start,
        End = gig.End,
        Address = gig.Address,
        MaxWorkers = gig.MaxWorkers,
        WorkerIds = gig.WorkerIds.ToArray(),
    };
}