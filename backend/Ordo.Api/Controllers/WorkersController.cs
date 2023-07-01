using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Mail;
using Ordo.Api.Models;
using Ordo.Api.Security;
using Ordo.Api.Services;

namespace Ordo.Api.Controllers;

[Authorize(Roles = RoleNames.Manager)]
[Route("workers")]
[ApiController]
public class WorkersController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IMailService _mailService;

    public WorkersController(ApplicationDbContext db, UserManager<IdentityUser> userManager, IMailService mailService)
    {
        _db = db;
        _userManager = userManager;
        _mailService = mailService;
    }

    [HttpPost]
    public async Task<ActionResult<WorkerDto>> Add(AddWorkerDto dto)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) != null)
        {
            return Conflict("A user with this email already exists.");
        }

        var resultCreateUser = await _userManager.CreateAsync(new IdentityUser
        {
            UserName = dto.Email,
            Email = dto.Email
        });

        if (!resultCreateUser.Succeeded)
        {
            throw new InvalidOperationException(resultCreateUser.Errors.ToString());
        }

        var user = await _userManager.FindByEmailAsync(dto.Email) ?? throw new InvalidOperationException();
        await _userManager.AddToRoleAsync(user, RoleNames.Worker);

        var qualifications = await _db.Qualifications
            .Where(q => dto.QualificationIds.ToList().Contains(q.Id.ToString()))
            .ToListAsync();

        if (qualifications.Count != dto.QualificationIds.Length)
        {
            return BadRequest("One or more qualifications is invalid.");
        }

        var worker = new Worker
        {
            Id = user.Id,
            Name = dto.Name,
            Notes = dto.Notes,
            Qualifications = qualifications
        };

        await _db.Workers.AddAsync(worker);
        await _db.SaveChangesAsync();

        // await _mailService.SendEmailAsync(new MailRequest
        // {
        //     ToEmail = user.Email!,
        //     Subject = "Tunnuksesi Ordo-palveluun",
        //     Body = "Tämä on testi",
        // });

        return Ok(WorkerDto.FromModel(worker));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkerDto>>> GetAll()
    {
        var workers = await _db.Workers.AsNoTracking().Include(w => w.Qualifications).OrderBy(w => w.Name).ToListAsync();

        return Ok(workers.Select(WorkerDto.FromModel));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<WorkerDto>>> Get(Guid id)
    {
        var worker = await _db.Workers.AsNoTracking().Include(w => w.Qualifications).SingleOrDefaultAsync(w => w.Id == id.ToString());

        if (worker == null)
        {
            return NotFound();
        }

        return Ok(WorkerDto.FromModel(worker));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<WorkerDto>> Edit(Guid id, [FromBody] EditWorkerDto dto)
    {
        var worker = await _db.Workers.Include(w => w.Qualifications).SingleOrDefaultAsync(w => w.Id == id.ToString());

        if (worker == null)
        {
            return NotFound();
        }

        var qualifications = await _db.Qualifications.Where(q => dto.QualificationIds.ToList().Contains(q.Id.ToString())).ToListAsync();
        if (qualifications.Count != dto.QualificationIds.Length)
        {
            return BadRequest("One or more invalid qualification IDs.");
        }

        worker.Name = dto.Name;
        worker.Qualifications = qualifications;
        worker.Notes = dto.Notes;

        await _db.SaveChangesAsync();

        return Ok(WorkerDto.FromModel(worker));
    }
}