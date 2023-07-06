

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Models;
using Ordo.Api.Security;

public class GigAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, Gig>
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public GigAuthorizationHandler(ApplicationDbContext db, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        Gig resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException();

        var user = await _userManager.FindByIdAsync(userId) ?? throw new InvalidOperationException();

        if (await _userManager.IsInRoleAsync(user, RoleNames.Manager))
        {
            context.Succeed(requirement);
            return;
        }

        var worker = await _db.Workers.Include(w => w.Qualifications).SingleOrDefaultAsync(w => w.Id == userId);

        if (worker != null && worker.Qualifications.Any(q => q.Id == resource.Qualification.Id))
        {
            context.Succeed(requirement);
        }
    }
}