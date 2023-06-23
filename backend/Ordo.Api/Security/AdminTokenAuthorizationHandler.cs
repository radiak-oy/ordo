using Microsoft.AspNetCore.Authorization;

namespace Ordo.Api.Security;

public class AdminTokenRequirement : IAuthorizationRequirement
{
    public string? AdminKey { get; }
    public AdminTokenRequirement(string? adminKey) =>
        AdminKey = adminKey;
}

public class AdminTokenAuthorizationHandler : AuthorizationHandler<AdminTokenRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        AdminTokenRequirement requirement)
    {
        if (!(context.Resource is DefaultHttpContext httpContext))
            return Task.CompletedTask;
        var adminKeyHeader = httpContext.Request.Headers["X-ADMIN-KEY"].SingleOrDefault();

        if (requirement.AdminKey == null)
            return Task.CompletedTask;

        if (adminKeyHeader != requirement.AdminKey)
            return Task.CompletedTask;

        context.Succeed(requirement);
        return Task.CompletedTask;
    }
}