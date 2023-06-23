using Ordo.Api.Models;

namespace Ordo.Api.Dtos;

public readonly record struct ProfileDto
{
    public string WorkerId { get; init; }
    public string Name { get; init; }
    public QualificationDto[] Qualifications { get; init; }
    public string Notes { get; init; }
    public static ProfileDto FromModel(Profile profile) => new ProfileDto
    {
        WorkerId = profile.WorkerId,
        Name = profile.Name,
        Qualifications = profile.Qualifications.Select(QualificationDto.FromModel).ToArray(),
        Notes = profile.Notes
    };
}