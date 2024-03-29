using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Models;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public DbSet<Gig> Gigs => Set<Gig>();
    public DbSet<Qualification> Qualifications => Set<Qualification>();
    public DbSet<Worker> Workers => Set<Worker>();
    public DbSet<TimesheetEntry> TimesheetEntries => Set<TimesheetEntry>();

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Worker>().HasKey(w => w.Id);
        modelBuilder.Entity<Worker>().HasMany(w => w.Qualifications).WithMany(q => q.Workers);

        modelBuilder.Entity<TimesheetEntry>().HasKey(t => new { t.WorkerId, t.GigId });

        base.OnModelCreating(modelBuilder);
    }
}