
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class DevelopmentSeeder : IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public DevelopmentSeeder(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

        if (!userManager.Users.Any())
        {
            await userManager.CreateAsync(new IdentityUser { UserName = "aaro" }, "aaro");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
