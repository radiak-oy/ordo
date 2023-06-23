namespace Ordo.Api.Dtos;

public readonly record struct LoginExternalGoogleDto
{
    public string Token { get; init; }
}