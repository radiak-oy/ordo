using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Ordo.Api.OpenApi;

public class SwaggerGenConfigureOptions : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        options.SupportNonNullableReferenceTypes();

        options.AddSecurityDefinition("Admin", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.ApiKey,
            In = ParameterLocation.Header,
            Name = "X-ADMIN-KEY",
        });

        options.SchemaFilter<RequireNonNullablePropertiesSchemaFilter>();
    }
}
