using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Models;
using Ordo.Api.Security;

namespace Ordo.Api.Controllers;

[Authorize]
[Route("timesheet-entries")]
[ApiController]
public class TimesheetEntriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IAuthorizationService _authz;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        throw new InvalidOperationException("User ID is missing");

    public TimesheetEntriesController(ApplicationDbContext db, IAuthorizationService authz)
    {
        _db = db;
        _authz = authz;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimesheetEntryDto>>> GetAll()
    {
        var entries = await _db.TimesheetEntries
            .AsNoTracking()
            .Where(t => t.WorkerId == UserId)
            .OrderByDescending(t => t.ClockIn)
            .ToListAsync();

        return Ok(entries.Select(TimesheetEntryDto.FromModel));
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpGet("worker/{workerId}")]
    public async Task<ActionResult<IEnumerable<TimesheetEntryDto>>> GetAllByWorker(string workerId)
    {
        var entries = await _db.TimesheetEntries
            .AsNoTracking()
            .Where(t => t.WorkerId == workerId)
            .OrderByDescending(t => t.ClockIn)
            .ToListAsync();

        return Ok(entries.Select(TimesheetEntryDto.FromModel));
    }

    [HttpPost]
    public async Task<ActionResult<TimesheetEntryDto>> Add(AddTimesheetEntryDto dto)
    {
        var gig = await _db.Gigs
            .AsNoTracking()
            .Include(g => g.Qualification)
            .Where(g => g.WorkerIds.Contains(UserId))
            .SingleOrDefaultAsync(g => g.Id.ToString() == dto.GigId);

        if (gig == null)
        {
            return NotFound();
        }

        var authzResult = await _authz.AuthorizeAsync(User, gig, PolicyNames.RequireResourceAccess);
        if (!authzResult.Succeeded)
        {
            return NotFound();
        }

        if (ValidateTimesheetEntry(dto.ClockIn, dto.ClockOut, gig, out string errorMessage) == false)
        {
            return UnprocessableEntity(errorMessage);
        }

        var entry = new TimesheetEntry
        {
            WorkerId = UserId,
            GigId = gig.Id.ToString(),
            ClockIn = dto.ClockIn.ToUniversalTime(),
            ClockOut = dto.ClockOut.ToUniversalTime(),
            IsConfirmed = false
        };

        await _db.TimesheetEntries.AddAsync(entry);
        await _db.SaveChangesAsync();

        return Ok(TimesheetEntryDto.FromModel(entry));
    }

    [Authorize(Roles = RoleNames.Manager)]
    [HttpPost("confirmed")]
    public async Task<ActionResult> Confirm(ConfirmTimesheetEntryDto dto)
    {
        var entry = await _db.TimesheetEntries
            .Where(t => t.WorkerId == dto.WorkerId)
            .SingleOrDefaultAsync(t => t.GigId == dto.GigId);

        if (entry == null)
        {
            return NotFound();
        }

        if (entry.ClockIn != dto.ClockIn)
        {
            return Conflict("The stored ClockIn doesn't match the one sent with the request.");
        }

        if (entry.ClockOut != dto.ClockOut)
        {
            return Conflict("The stored ClockOut time doesn't match the one sent with the request.");
        }

        if (entry.IsConfirmed)
        {
            return Conflict("The entry is already confirmed.");
        }

        entry.IsConfirmed = true;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut]
    public async Task<ActionResult<TimesheetEntryDto>> Edit(EditTimesheetEntryDto dto)
    {
        var entry = await _db.TimesheetEntries
            .Where(t => t.WorkerId == UserId)
            .SingleOrDefaultAsync(t => t.GigId == dto.GigId);

        if (entry == null)
        {
            return NotFound();
        }

        if (entry.IsConfirmed)
        {
            return Conflict("The entry is already confirmed and can't be modified.");
        }

        var gig = await _db.Gigs
            .AsNoTracking()
            .Include(g => g.Qualification)
            .Where(g => g.WorkerIds.Contains(UserId))
            .SingleOrDefaultAsync(g => g.Id.ToString() == dto.GigId);

        if (gig == null)
        {
            return NotFound();
        }

        var authzResult = await _authz.AuthorizeAsync(User, gig, PolicyNames.RequireResourceAccess);
        if (!authzResult.Succeeded)
        {
            return NotFound();
        }

        if (ValidateTimesheetEntry(dto.ClockIn, dto.ClockOut, gig, out string errorMessage) == false)
        {
            return UnprocessableEntity(errorMessage);
        }

        entry.ClockIn = dto.ClockIn.ToUniversalTime();
        entry.ClockOut = dto.ClockOut.ToUniversalTime();

        await _db.SaveChangesAsync();

        return Ok(TimesheetEntryDto.FromModel(entry));
    }

    private bool ValidateTimesheetEntry(DateTimeOffset clockIn, DateTimeOffset clockOut, Gig gig, out string errorMessage)
    {
        var clockInUtc = clockIn.ToUniversalTime();
        var clockOutUtc = clockOut.ToUniversalTime();

        if (clockOutUtc <= clockInUtc)
        {
            errorMessage = "ClockOut must be after ClockIn.";
            return false;
        }

        if (clockInUtc > DateTimeOffset.UtcNow)
        {
            errorMessage = "ClockIn can't be in the future.";
            return false;
        }

        if (clockOutUtc > DateTimeOffset.UtcNow)
        {
            errorMessage = "ClockOut can't be in the future.";
            return false;
        }

        if (clockInUtc < gig.Start || clockInUtc >= gig.End)
        {
            errorMessage = "ClockIn must be between the start and end of the gig.";
            return false;
        }

        if (clockOutUtc <= gig.Start || clockOutUtc > gig.End)
        {
            errorMessage = "ClockOut must be between the start and end of the gig.";
            return false;
        }

        errorMessage = "";
        return true;
    }
}