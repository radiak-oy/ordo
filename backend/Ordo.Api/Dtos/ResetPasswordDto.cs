namespace Ordo.Api.Dtos;

public readonly record struct ResetPasswordDto
{
    public string UserId { get; init; }
    public string Token { get; init; }
    public string NewPassword { get; init; }
}