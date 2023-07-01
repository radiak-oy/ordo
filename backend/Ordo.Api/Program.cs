using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql;
using Ordo.Api.OpenApi;
using Ordo.Api.Options;
using Ordo.Api.Security;
using Ordo.Api.Services;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile(builder.Environment.IsProduction() ? "appsettings.json" : "appsettings.Development.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionStringBuilder = new NpgsqlConnectionStringBuilder(connectionString)
    {
        Password = builder.Configuration["DbPassword"] ?? "ordo",
    };
    options.UseNpgsql(connectionStringBuilder.ConnectionString);
});

builder.Services.AddSingleton<IHostedService, DbSeeder>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, SwaggerGenConfigureOptions>();
builder.Services.AddSwaggerGen();

builder.Services
    .AddIdentity<IdentityUser, IdentityRole>(options =>
    {
        // TODO: CHANGE
        options.Password.RequiredLength = 4;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
    })
    .AddDefaultTokenProviders()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    options.TokenLifespan = TimeSpan.FromDays(1);
});

// builder.Services.AddAuthentication().AddCookie().AddGoogle(options =>
// {
//     options.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? throw new InvalidOperationException();
//     options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? throw new InvalidOperationException();
// });

builder.Services.AddAuthorization(authzOptions =>
{
    authzOptions.AddPolicy(PolicyNames.RequireAdminToken, policy => policy.AddRequirements(new AdminTokenRequirement(builder.Configuration["AdminKey"])));
});

builder.Services.AddSingleton<IAuthorizationHandler, AdminTokenAuthorizationHandler>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.SlidingExpiration = false;
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(365);

    options.Events = new CookieAuthenticationEvents
    {
        OnRedirectToLogin = ctx =>
        {
            ctx.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }
    };
});

builder.Services.Configure<MailOptions>(builder.Configuration.GetSection(MailOptions.Mail));
builder.Services.AddTransient<IMailService, MailService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.EnableTryItOutByDefault();
    });
}

app.UsePathBase("/api");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
