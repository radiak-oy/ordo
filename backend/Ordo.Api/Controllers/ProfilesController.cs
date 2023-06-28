using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Models;
using Ordo.Api.Security;

namespace Ordo.Api.Controllers;

[Authorize(Roles = RoleNames.Manager)]
[Route("profiles")]
[ApiController]
public class ProfilesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;

    public ProfilesController(ApplicationDbContext db, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<ActionResult<ProfileDto>> Create(CreateProfileDto dto)
    {
        var userId = Guid.NewGuid().ToString();
        var resultCreateUser = await _userManager.CreateAsync(new IdentityUser
        {
            Id = userId,
            UserName = userId,
        });

        if (!resultCreateUser.Succeeded)
        {
            throw new InvalidOperationException(resultCreateUser.Errors.ToString());
        }

        var user = await _userManager.FindByIdAsync(userId) ?? throw new InvalidOperationException();
        await _userManager.AddToRoleAsync(user, RoleNames.Worker);

        var qualifications = await _db.Qualifications
            .Where(q => dto.QualificationIds.ToList().Contains(q.Id.ToString()))
            .ToListAsync();

        if (qualifications.Count != dto.QualificationIds.Length)
        {
            return BadRequest("One or more qualifications is invalid.");
        }

        var profile = new Profile
        {
            WorkerId = userId,
            Name = dto.Name,
            Notes = dto.Notes,
            Qualifications = qualifications
        };

        await _db.Profiles.AddAsync(profile);
        await _db.SaveChangesAsync();

        return Ok(ProfileDto.FromModel(profile));
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

        var qualifications = await _db.Qualifications.Where(q => dto.QualificationIds.ToList().Contains(q.Id.ToString())).ToListAsync();
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