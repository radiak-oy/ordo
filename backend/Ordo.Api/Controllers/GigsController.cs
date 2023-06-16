using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Models;

namespace Ordo.Api.Controllers;

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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GigDto>>> GetAll()
    {
        var gigs = await _db.Gigs.ToListAsync();
        return Ok(gigs.Select(GigDto.FromModel));
    }

    [HttpPost]
    public async Task<ActionResult<GigDto>> Post(CreateGigDto dto)
    {
        var gig = new Gig()
        {
            Type = dto.Type,
            Start = dto.Start,
            End = dto.End,
            Address = dto.Address,
            MaxWorkers = dto.MaxWorkers,
            WorkerIds = new List<string>()
        };

        await _db.Gigs.AddAsync(gig);
        await _db.SaveChangesAsync();

        return Ok(GigDto.FromModel(gig));
    }

    [HttpPost("{id}/signup")]
    public async Task<ActionResult> SignUp(Guid id)
    {
        var gig = await _db.Gigs.FindAsync(id);

        if (gig == null) return NotFound();

        if (gig.WorkerIds.Count == gig.MaxWorkers) return BadRequest("The gig is full.");

        gig.WorkerIds.Add("testi user id");

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete]
    public async Task<ActionResult> Delete(Guid id)
    {
        var gig = await _db.Gigs.FindAsync(id);

        if (gig == null) return NotFound();

        _db.Gigs.Remove(gig);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}