namespace Ordo.Api.Dtos;

public readonly record struct CreateProfileDto
{
    public string Name { get; init; }
    public string[] QualificationIds { get; init; }
    public string Notes { get; init; }
}