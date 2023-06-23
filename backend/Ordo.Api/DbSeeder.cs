
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Models;
using Ordo.Api.Security;

public class DbSeeder : IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public DbSeeder(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        bool isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

        if (isDevelopment)
        {
            await db.Database.MigrateAsync();
        }

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        if (!roleManager.Roles.Any())
        {
            await roleManager.CreateAsync(new IdentityRole { Name = RoleNames.Manager });
            await roleManager.CreateAsync(new IdentityRole { Name = RoleNames.Worker });
        }

        if (!db.Qualifications.Any())
        {
            await db.Qualifications.AddAsync(new Qualification { Name = "Haalaus" });
            await db.Qualifications.AddAsync(new Qualification { Name = "Laatoitus" });
            await db.Qualifications.AddAsync(new Qualification { Name = "Purkutyö" });

            await db.SaveChangesAsync();
        }

        if (isDevelopment)
        {
            if (!userManager.Users.Any())
            {
                await userManager.CreateAsync(new IdentityUser { UserName = "robert" }, "robert");

                var manager = await userManager.FindByNameAsync("robert") ?? throw new InvalidOperationException();

                await userManager.AddToRoleAsync(manager, RoleNames.Manager);

                await userManager.CreateAsync(new IdentityUser { UserName = "aaro" }, "aaro");
                await userManager.CreateAsync(new IdentityUser { UserName = "matti" }, "matti");

                var aaro = await userManager.FindByNameAsync("aaro") ?? throw new InvalidOperationException();
                var matti = await userManager.FindByNameAsync("matti") ?? throw new InvalidOperationException();

                await userManager.AddToRoleAsync(aaro, RoleNames.Worker);
                await userManager.AddToRoleAsync(matti, RoleNames.Worker);
            }

            if (!db.Profiles.Any())
            {
                var userAaro = await userManager.FindByNameAsync("aaro") ?? throw new InvalidOperationException();
                var userMatti = await userManager.FindByNameAsync("matti") ?? throw new InvalidOperationException();

                var qualificationHaalaus = await db.Qualifications.SingleAsync(q => q.Name == "Haalaus");
                var qualificationLaatoitus = await db.Qualifications.SingleAsync(q => q.Name == "Laatoitus");
                var qualificationPurkutyö = await db.Qualifications.SingleAsync(q => q.Name == "Purkutyö");

                var profileAaro = new Profile
                {
                    WorkerId = userAaro.Id,
                    Name = "Aaro Karell",
                    Qualifications = new List<Qualification>(),
                    Notes = "Suorittanut vuorot: 15.06, 19.06. yht. 14 tuntia"
                };

                var profileMatti = new Profile
                {
                    WorkerId = userMatti.Id,
                    Name = "Matti Tamminen",
                    Qualifications = new List<Qualification>(),
                    Notes = "Poissa heinäkuuhun asti."
                };

                await db.Profiles.AddAsync(profileAaro);
                await db.Profiles.AddAsync(profileMatti);

                profileAaro.Qualifications.Add(qualificationHaalaus);

                profileMatti.Qualifications.Add(qualificationHaalaus);
                profileMatti.Qualifications.Add(qualificationLaatoitus);
                profileMatti.Qualifications.Add(qualificationPurkutyö);

                await db.SaveChangesAsync();
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
