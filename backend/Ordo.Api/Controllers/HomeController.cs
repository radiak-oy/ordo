using System.Security.Claims;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Models;
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

    [AllowAnonymous]
    [HttpPost("login-google")]
    public async Task<ActionResult> LoginWithGoogle(LoginGoogleDto dto)
    {
        var authzCodeFlow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new()
            {
                ClientId = _configuration["Authentication:Google:ClientId"],
                ClientSecret = _configuration["Authentication:Google:ClientSecret"],
            },
        });

        var tokenResponse = await authzCodeFlow.ExchangeCodeForTokenAsync(Guid.NewGuid().ToString(), dto.Code, redirectUri: _configuration["OAuth:Google:RedirectUri"], CancellationToken.None);

        var idTokenPayload = await GoogleJsonWebSignature.ValidateAsync(tokenResponse.IdToken);

        var externalUserRecord = await _db.ExternalUsers.SingleOrDefaultAsync(x => x.Email == idTokenPayload.Email);

        if (externalUserRecord == null)
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByEmailAsync(idTokenPayload.Email);

        if (user == null)
        {
            var resultCreateUser = await _userManager.CreateAsync(new IdentityUser
            {
                UserName = idTokenPayload.Email,
                Email = idTokenPayload.Email,
            });

            if (!resultCreateUser.Succeeded)
            {
                return BadRequest(resultCreateUser.Errors);
            }

            user = await _userManager.FindByEmailAsync(idTokenPayload.Email) ?? throw new InvalidOperationException();

            var resultAddToRole = await _userManager.AddToRoleAsync(user, externalUserRecord.Role);

            if (!resultAddToRole.Succeeded)
            {
                throw new InvalidOperationException(resultAddToRole.Errors.ToString());
            }

            if (await _userManager.IsInRoleAsync(user, RoleNames.Worker))
            {
                var profile = new Profile
                {
                    WorkerId = user.Id,
                    Name = idTokenPayload.Name,
                    Qualifications = new List<Qualification>(),
                    Notes = $"Kirjautui sisään Googlen kautta. Sähköpostiosoite: {idTokenPayload.Email}",
                };

                await _db.Profiles.AddAsync(profile);
                await _db.SaveChangesAsync();
            }
        }

        await _signInManager.SignInAsync(user, isPersistent: true);

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