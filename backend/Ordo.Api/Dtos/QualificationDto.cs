using Ordo.Api.Models;

namespace Ordo.Api.Dtos;

public readonly record struct QualificationDto
{
    public string Id { get; init; }
    public string Name { get; init; }

    public static QualificationDto FromModel(Qualification qualification) => new QualificationDto
    {
        Id = qualification.Id.ToString(),
        Name = qualification.Name
    };
}