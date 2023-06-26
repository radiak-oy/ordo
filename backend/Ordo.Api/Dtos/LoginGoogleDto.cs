namespace Ordo.Api.Dtos;

public readonly record struct LoginGoogleDto
{
    public string AuthUser { get; init; }
    public string Code { get; init; }
    public string Scope { get; init; }
    public string Prompt { get; init; }
}