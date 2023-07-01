namespace Ordo.Api.Dtos;

public readonly record struct RequestResetPasswordDto
{
    public string Email { get; init; }
}