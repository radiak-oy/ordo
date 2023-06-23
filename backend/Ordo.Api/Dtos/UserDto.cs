using Microsoft.AspNetCore.Identity;

namespace Ordo.Api.Dtos;

public readonly record struct UserDto
{
    public string Id { get; init; }
    public string? UserName { get; init; }
    public string[] Roles { get; init; }

    public static UserDto FromModel(IdentityUser user, string[] roles) => new UserDto
    {
        Id = user.Id,
        UserName = user.UserName,
        Roles = roles
    };
}