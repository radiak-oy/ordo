namespace Ordo.Api.Dtos;

public readonly record struct AddWorkerDto
{
    public string Email { get; init; }
    public string Name { get; init; }
    public string[] QualificationIds { get; init; }
    public string Notes { get; init; }
}