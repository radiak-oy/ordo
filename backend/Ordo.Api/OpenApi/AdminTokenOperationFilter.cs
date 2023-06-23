using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Ordo.Api.Security;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Ordo.Api.OpenApi;

public class AdminTokenOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (context.MethodInfo.DeclaringType == null)
            throw new InvalidOperationException();

        // Policy names from controllers and endpoints
        var policiesClass = context.MethodInfo.DeclaringType
            .GetCustomAttributes(true)
            .OfType<AuthorizeAttribute>()
            .Select(x => x.Policy);
        var policiesMethod = context.MethodInfo
            .GetCustomAttributes(true)
            .OfType<AuthorizeAttribute>()
            .Select(x => x.Policy);

        var policies = policiesClass.Union(policiesMethod).Distinct();

        if (policies.Any(x => x == PolicyNames.RequireAdminToken))
        {
            var adminKeyScheme = new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Admin" }
            };
            operation.Security = new List<OpenApiSecurityRequirement>
            {
                new OpenApiSecurityRequirement
                {
                    [adminKeyScheme] = new string[] {},
                }
            };
        }
    }
}
