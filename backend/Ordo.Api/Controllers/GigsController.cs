using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Models;
using Ordo.Api.Security;

namespace Ordo.Api.Controllers;

[Authorize]
[Route("gigs")]
[ApiController]
public class GigsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IAuthorizationService _authz;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        throw new InvalidOperationException("User ID is missing");

    public GigsController(ApplicationDbContext db, IAuthorizationService authz)
    {
        _db = db;
        _authz = authz;
    }

    [HttpGet("done")]
    public async Task<ActionResult<IEnumerable<DoneGigDto>>> GetAllDone()
    {
        var worker = await _db.Workers
            .AsNoTracking()
            .Include(w => w.Qualifications)
            .SingleOrDefaultAsync(w => w.Id == UserId);

        if (worker == null)
        {
            return NotFound();
        }

        var gigsDone = await _db.Gigs
            .AsNoTracking()
            .Include(g => g.Qualification)
            .OrderByDescending(g => g.Start)
            .Where(g => g.WorkerIds.Contains(worker.Id))
            .Where(g => g.Start <= DateTimeOffset.UtcNow)
            .ToListAsync();

        return Ok(gigsDone.Select(DoneGigDto.FromModel));
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<IEnumerable<UpcomingGigDto>>> GetAllUpcoming()
    {
        var worker = await _db.Workers
            .AsNoTracking()
            .Include(w => w.Qualifications)
            .SingleOrDefaultAsync(w => w.Id == UserId);

        if (worker == null)
        {
            return NotFound();
        }

        var gigsUpcoming = await _db.Gigs
            .AsNoTracking()
            .Include(g => g.Qualification)
            .OrderBy(g => g.Start)
            .Where(g => DateTimeOffset.UtcNow < g.Start)
            .Where(g => worker.Qualifications.Contains(g.Qualification))
            .ToListAsync();

        return Ok(gigsUpcoming.Select(g => UpcomingGigDto.FromModel(g, isSignedUp: g.WorkerIds.Contains(worker.Id))));
    }

    [HttpPost("{id}/workers")]
    public async Task<ActionResult> SignUp(Guid id)
    {
        var gig = await _db.Gigs
            .Include(g => g.Qualification)
            .SingleOrDefaultAsync(g => g.Id == id);

        if (gig == null)
        {
            return NotFound();
        }

        var authzResult = await _authz.AuthorizeAsync(User, gig, PolicyNames.RequireResourceAccess);
        if (!authzResult.Succeeded)
        {
            return NotFound();
        }

        if (gig.WorkerIds.Any(id => id == UserId))
        {
            return Conflict("You are already signed up.");
        }

        if (gig.WorkerIds.Count == gig.MaxWorkers)
        {
            return Conflict("The job is full.");
        }

        gig.WorkerIds.Add(UserId);

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}/workers")]
    public async Task<ActionResult> CancelSignUp(Guid id)
    {
        var gig = await _db.Gigs
            .Include(g => g.Qualification)
            .SingleOrDefaultAsync(g => g.Id == id);

        if (gig == null)
        {
            return NotFound();
        }

        var authzResult = await _authz.AuthorizeAsync(User, gig, PolicyNames.RequireResourceAccess);
        if (!authzResult.Succeeded)
        {
            return NotFound();
        }

        if (!gig.WorkerIds.Any(id => id == UserId))
        {
            return Conflict("You are not signed up.");
        }

        gig.WorkerIds.Remove(UserId);

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GigDto>>> GetAll()
    {
        var gigs = await _db.Gigs
            .AsNoTracking()
            .Include(g => g.Qualification)
            .OrderBy(g => g.Start)
            .ToListAsync();

        return Ok(gigs.Select(GigDto.FromModel));
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpGet("{id}")]
    public async Task<ActionResult<GigDto>> Get(Guid id)
    {
        var gig = await _db.Gigs
            .AsNoTracking()
            .Include(g => g.Qualification)
            .SingleOrDefaultAsync(g => g.Id == id);

        if (gig == null)
        {
            return NotFound();
        }

        return Ok(gig);
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpPost]
    public async Task<ActionResult<GigDto>> Post(PostGigDto dto)
    {
        var qualification = await _db.Qualifications.FindAsync(dto.QualificationId);
        if (qualification == null)
        {
            return NotFound("Qualification not found.");
        }

        if (dto.End <= dto.Start)
        {
            return UnprocessableEntity("End must be after Start.");
        }

        if ((dto.End - dto.Start).TotalHours >= 18)
        {
            return UnprocessableEntity("The gig can't last over 18 hours.");
        }

        var gig = new Gig()
        {
            Qualification = qualification,
            Start = dto.Start.ToUniversalTime(),
            End = dto.End.ToUniversalTime(),
            Address = dto.Address.Trim(),
            MaxWorkers = dto.MaxWorkers,
            WorkerIds = new List<string>(),
            Description = dto.Description.Trim(),
        };

        await _db.Gigs.AddAsync(gig);
        await _db.SaveChangesAsync();

        return Ok(GigDto.FromModel(gig));
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpPut("{id}")]
    public async Task<ActionResult<GigDto>> Edit(Guid id, [FromBody] EditGigDto dto)
    {
        var gig = await _db.Gigs
            .Include(g => g.Qualification)
            .SingleOrDefaultAsync(g => g.Id == id);

        if (gig == null)
        {
            return NotFound();
        }

        if (dto.End <= dto.Start)
        {
            return UnprocessableEntity("End must be after Start.");
        }

        if (dto.WorkerIds.Length > dto.MaxWorkers)
        {
            return UnprocessableEntity("Max workers must be greater or equal to the amount of workers.");
        }

        if ((dto.End - dto.Start).TotalHours >= 18)
        {
            return UnprocessableEntity("The gig can't last over 18 hours.");
        }

        // TODO: check qualifications etc.

        gig.Start = dto.Start;
        gig.End = dto.End;
        gig.Address = dto.Address.Trim();
        gig.MaxWorkers = dto.MaxWorkers;
        gig.WorkerIds = dto.WorkerIds.ToList();
        gig.Description = dto.Description.Trim();

        await _db.SaveChangesAsync();

        return Ok(gig);
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var gig = await _db.Gigs.FindAsync(id);

        if (gig == null) return NotFound();

        // TODO: disallow delete when job is not empty

        _db.Gigs.Remove(gig);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}