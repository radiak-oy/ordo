using Ordo.Api.Models;

namespace Ordo.Api.Dtos;

public readonly record struct WorkerDto
{
    public string Id { get; init; }
    public string Name { get; init; }
    public QualificationDto[] Qualifications { get; init; }
    public string Notes { get; init; }

    public static WorkerDto FromModel(Worker worker) => new WorkerDto
    {
        Id = worker.Id,
        Name = worker.Name,
        Qualifications = worker.Qualifications.Select(QualificationDto.FromModel).ToArray(),
        Notes = worker.Notes
    };
}