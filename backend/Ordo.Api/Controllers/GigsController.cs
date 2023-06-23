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

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        throw new InvalidOperationException("User ID is missing");

    public GigsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("done")]
    public async Task<ActionResult<IEnumerable<DoneGigDto>>> GetAllDone()
    {
        var profile = await _db.Profiles
            .Include(p => p.Qualifications)
            .SingleOrDefaultAsync(p => p.WorkerId == UserId);

        if (profile == null)
        {
            return NotFound();
        }

        var gigsDone = await _db.Gigs
            .Include(g => g.Qualification)
            .OrderBy(g => g.Start)
            .Where(g => g.WorkerIds.Contains(profile.WorkerId))
            .Where(g => g.End < DateTimeOffset.UtcNow)
            .ToListAsync();

        var dtos = gigsDone.Select(g => new DoneGigDto
        {
            Id = g.Id,
            Qualification = g.Qualification.Name,
            Start = g.Start,
            End = g.End,
            Address = g.Address,
        });

        return Ok(dtos);
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<IEnumerable<UpcomingGigDto>>> GetAllUpcoming()
    {
        var profile = await _db.Profiles
            .Include(p => p.Qualifications)
            .SingleOrDefaultAsync(p => p.WorkerId == UserId);

        if (profile == null)
        {
            return NotFound();
        }

        var gigsUpcoming = await _db.Gigs
            .Include(g => g.Qualification)
            .OrderBy(g => g.Start)
            .Where(g => DateTimeOffset.UtcNow <= g.End)
            .Where(g => profile.Qualifications.Contains(g.Qualification))
            .ToListAsync();

        var dtos = gigsUpcoming.Select(g => new UpcomingGigDto
        {
            Id = g.Id,
            Qualification = g.Qualification.Name,
            Start = g.Start,
            End = g.End,
            Address = g.Address,
            IsSignedUp = g.WorkerIds.Contains(profile.WorkerId)
        });

        return Ok(dtos);
    }

    [HttpPost("{id}/signup")]
    public async Task<ActionResult> SignUp(Guid id)
    {
        var gig = await _db.Gigs.Include(g => g.Qualification).SingleOrDefaultAsync(g => g.Id == id);
        if (gig == null)
        {
            return NotFound();
        }

        var profile = await _db.Profiles.AsNoTracking().Include(p => p.Qualifications).SingleOrDefaultAsync(p => p.WorkerId == UserId);
        if (profile == null)
        {
            return NotFound("Profile not found.");
        }

        if (gig.WorkerIds.Any(id => id == profile.WorkerId))
        {
            return Conflict("You are already signed up.");
        }

        if (!profile.Qualifications.Any(q => q.Id == gig.Qualification.Id))
        {
            return Forbid();
        }

        if (gig.WorkerIds.Count == gig.MaxWorkers)
        {
            return Conflict("The job is full.");
        }

        gig.WorkerIds.Add(UserId);

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/signup-cancel")]
    public async Task<ActionResult> CancelSignUp(Guid id)
    {
        var gig = await _db.Gigs.Include(g => g.Qualification).SingleOrDefaultAsync(g => g.Id == id);
        if (gig == null)
        {
            return NotFound();
        }

        var profile = await _db.Profiles.AsNoTracking().Include(p => p.Qualifications).SingleOrDefaultAsync(p => p.WorkerId == UserId);
        if (profile == null)
        {
            return NotFound("Profile not found.");
        }

        if (!gig.WorkerIds.Any(id => id == profile.WorkerId))
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
        var gigs = await _db.Gigs.AsNoTracking().Include(g => g.Qualification).OrderBy(g => g.Start).ToListAsync();
        return Ok(gigs.Select(GigDto.FromModel));
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpGet("{id}")]
    public async Task<ActionResult<GigDto>> Get(Guid id)
    {
        var gig = await _db.Gigs.AsNoTracking().Include(g => g.Qualification).SingleOrDefaultAsync(g => g.Id == id);

        if (gig == null) return NotFound();

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
            return BadRequest("End must be after Start.");
        }

        var gig = new Gig()
        {
            Qualification = qualification,
            Start = dto.Start.ToUniversalTime(),
            End = dto.End.ToUniversalTime(),
            Address = dto.Address,
            MaxWorkers = dto.MaxWorkers,
            WorkerIds = new List<string>()
        };

        await _db.Gigs.AddAsync(gig);
        await _db.SaveChangesAsync();

        return Ok(GigDto.FromModel(gig));
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpPut("{id}")]
    public async Task<ActionResult<GigDto>> Edit(Guid id, [FromBody] EditGigDto dto)
    {
        var gig = await _db.Gigs.Include(g => g.Qualification).SingleOrDefaultAsync(g => g.Id == id);
        if (gig == null)
        {
            return NotFound();
        }

        if (dto.End <= dto.Start)
        {
            return BadRequest("End must be after Start.");
        }
        if (dto.WorkerIds.Length > dto.MaxWorkers)
        {
            return BadRequest("Max workers must be greater or equal to the amount of workers.");
        }

        // TODO: check qualifications etc.

        gig.Start = dto.Start;
        gig.End = dto.End;
        gig.Address = dto.Address;
        gig.MaxWorkers = dto.MaxWorkers;
        gig.WorkerIds = dto.WorkerIds.ToList();

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