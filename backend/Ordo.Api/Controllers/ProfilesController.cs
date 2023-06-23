using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Security;

namespace Ordo.Api.Controllers;

[Authorize(Roles = RoleNames.Manager)]
[Route("profiles")]
[ApiController]
public class ProfilesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ProfilesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProfileDto>>> GetAll()
    {
        var profiles = await _db.Profiles.AsNoTracking().Include(p => p.Qualifications).OrderBy(p => p.Name).ToListAsync();

        return Ok(profiles.Select(ProfileDto.FromModel));
    }

    [HttpGet("{workerId}")]
    public async Task<ActionResult<IEnumerable<ProfileDto>>> Get(Guid workerId)
    {
        var profile = await _db.Profiles.AsNoTracking().Include(p => p.Qualifications).SingleOrDefaultAsync(p => p.WorkerId == workerId.ToString());

        if (profile == null)
        {
            return NotFound();
        }

        return Ok(ProfileDto.FromModel(profile));
    }

    [HttpPut("{workerId}")]
    public async Task<ActionResult<ProfileDto>> Edit(Guid workerId, [FromBody] EditProfileDto dto)
    {
        var profile = await _db.Profiles.Include(p => p.Qualifications).SingleOrDefaultAsync(p => p.WorkerId == workerId.ToString());

        if (profile == null)
        {
            return NotFound();
        }

        var qualifications = await _db.Qualifications.Where(q => dto.QualificationIds.Any(id => q.Id.ToString() == id)).ToListAsync();
        if (qualifications.Count != dto.QualificationIds.Length)
        {
            return BadRequest("One or more invalid qualification IDs.");
        }

        profile.Name = dto.Name;
        profile.Qualifications = qualifications;
        profile.Notes = dto.Notes;

        await _db.SaveChangesAsync();

        return Ok(ProfileDto.FromModel(profile));
    }
}