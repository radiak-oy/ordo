namespace Ordo.Api.Dtos;

public readonly record struct LoginResponseDto
{
    public bool IsAdmin { get; init; }
}