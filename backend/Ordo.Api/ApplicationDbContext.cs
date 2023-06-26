using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Models;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public DbSet<Gig> Gigs => Set<Gig>();
    public DbSet<Qualification> Qualifications => Set<Qualification>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<ExternalUser> ExternalUsers => Set<ExternalUser>();

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Profile>().HasKey(p => p.WorkerId);
        modelBuilder.Entity<Profile>().HasMany(p => p.Qualifications).WithMany(q => q.Profiles);

        modelBuilder.Entity<ExternalUser>().HasKey(x => x.Email);

        base.OnModelCreating(modelBuilder);
    }
}