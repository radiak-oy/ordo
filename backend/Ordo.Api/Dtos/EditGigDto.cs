using System.ComponentModel.DataAnnotations;

namespace Ordo.Api.Dtos;

public readonly record struct EditGigDto
{
    public DateTimeOffset Start { get; init; }
    public DateTimeOffset End { get; init; }
    public string Address { get; init; }

    [Range(1, int.MaxValue)]
    public int MaxWorkers { get; init; }
    public string[] WorkerIds { get; init; }
    public string Description { get; init; }
}