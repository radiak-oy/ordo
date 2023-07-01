namespace Ordo.Api.Dtos;

public readonly record struct EditWorkerDto
{
    public string Name { get; init; }
    public string[] QualificationIds { get; init; }
    public string Notes { get; init; }
}