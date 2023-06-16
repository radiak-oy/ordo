using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql;
using Ordo.Api.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionStringBuilder = new NpgsqlConnectionStringBuilder(connectionString)
    {
        Password = builder.Configuration["DbPassword"] ?? "ordo",
    };
    options.UseNpgsql(connectionStringBuilder.ConnectionString);
});

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSingleton<IHostedService, DevelopmentSeeder>();
}

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
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
    })
    .AddCookie()
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? throw new InvalidOperationException("Google ClientId missing");
        options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? throw new InvalidOperationException("Google ClientSecret missing");
        options.Events.OnTicketReceived = async ctx =>
        {
            var email = ctx.Principal?.FindFirstValue(ClaimTypes.Email);

            if (email == null) throw new InvalidOperationException();

            var userManager = ctx.HttpContext.RequestServices.GetRequiredService<UserManager<IdentityUser>>();
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new IdentityUser
                {
                    Email = email,
                };

                var result = await userManager.CreateAsync(user);

                if (!result.Succeeded) throw new InvalidOperationException(result.Errors.ToString());
            }

            var signInManager = ctx.HttpContext.RequestServices.GetRequiredService<SignInManager<IdentityUser>>();
            await signInManager.SignInAsync(user, isPersistent: true);
        };
    });

builder.Services.ConfigureApplicationCookie(options =>
{
    options.SlidingExpiration = false;
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(1);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.EnableTryItOutByDefault();
    });
}
else
{
    app.UseHttpsRedirection();
    app.UseHsts();
}

app.UsePathBase("/api");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
