using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Security;

namespace Ordo.Api.Controllers;

[Authorize(Roles = RoleNames.Manager)]
[Route("qualifications")]
[ApiController]
public class QualificationsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public QualificationsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<QualificationDto>>> GetAll()
    {
        var qualifications = await _db.Qualifications
            .OrderBy(q => q.Name)
            .ToListAsync();

        return Ok(qualifications.Select(QualificationDto.FromModel));
    }
}