using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Ordo.Api.Controllers;

[ApiController]
[Route("/")]
public class HomeController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public HomeController(ApplicationDbContext db, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
    {
        _db = db;
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [Authorize]
    [HttpGet("whoami")]
    public ActionResult<string> WhoAmI()
    {
        var userId = User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException();
        var username = User?.Identity?.Name ?? "";

        return Ok($"{username} {userId}");
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAsync()
    {
        await _signInManager.SignOutAsync();

        return NoContent();
    }
}