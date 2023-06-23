namespace Ordo.Api.Dtos;

public readonly record struct LoginDto
{
    public string UserName { get; init; }
    public string Password { get; init; }
}