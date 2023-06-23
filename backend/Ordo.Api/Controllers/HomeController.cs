using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Ordo.Api.Dtos;
using Ordo.Api.Security;

namespace Ordo.Api.Controllers;

[Authorize]
[ApiController]
[Route("/")]
public class HomeController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _configuration;

    public HomeController(ApplicationDbContext db, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IConfiguration configuration)
    {
        _db = db;
        _signInManager = signInManager;
        _userManager = userManager;
        _configuration = configuration;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> LoginAsync(LoginDto dto)
    {
        var result = await _signInManager.PasswordSignInAsync(dto.UserName, dto.Password, isPersistent: true, lockoutOnFailure: false); // TODO: lockout

        if (result.Succeeded)
        {
            var user = await _userManager.FindByNameAsync(dto.UserName) ?? throw new InvalidOperationException();

            Response.Cookies.Append("username", user.UserName!, new CookieOptions
            {
                Expires = DateTimeOffset.Now.AddDays(365),
                IsEssential = true,
                SameSite = SameSiteMode.Lax,
            });

            var role = await _userManager.IsInRoleAsync(user, RoleNames.Manager) ? "manager" : "worker";

            Response.Cookies.Append("role", role, new CookieOptions
            {
                Expires = DateTimeOffset.Now.AddDays(365),
                IsEssential = true,
                SameSite = SameSiteMode.Lax,
            });

            return NoContent();
        }

        if (result.IsLockedOut)
        {
            return Forbid("Locked out.");
        }

        return Unauthorized();
    }

    [HttpGet("whoami")]
    public async Task<ActionResult<UserDto>> WhoAmI()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException();

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null) return NotFound();

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(UserDto.FromModel(user, roles.ToArray()));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAsync()
    {
        await _signInManager.SignOutAsync();
        Response.Cookies.Delete("username");
        Response.Cookies.Delete("role");

        return NoContent();
    }
}