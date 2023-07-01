using System.Security.Claims;
using System.Text.Encodings.Web;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Flows;
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

[Authorize]
[ApiController]
[Route("/")]
public class HomeController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IMailService _mailService;
    private readonly IConfiguration _configuration;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        throw new InvalidOperationException("User ID is missing");

    public HomeController(ApplicationDbContext db, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IConfiguration configuration, IMailService mailService)
    {
        _db = db;
        _signInManager = signInManager;
        _userManager = userManager;
        _configuration = configuration;
        _mailService = mailService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
        {
            return Unauthorized();
        }

        if (user.UserName == null) throw new InvalidOperationException();

        var result = await _signInManager.PasswordSignInAsync(user.UserName, dto.Password, isPersistent: true, lockoutOnFailure: false); // TODO: lockout

        if (result.Succeeded)
        {
            await AddLoginCookies(Response, user);

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

        var tokenResponse = await authzCodeFlow.ExchangeCodeForTokenAsync(
            Guid.NewGuid().ToString(),
            dto.Code,
            redirectUri: _configuration["WebBaseUrl"],
            CancellationToken.None);

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
                var workerNew = new Worker
                {
                    Id = user.Id,
                    Name = idTokenPayload.Name,
                    Qualifications = new List<Qualification>(),
                    Notes = $"Kirjautui sisään Googlen kautta. Sähköpostiosoite: {idTokenPayload.Email}",
                };

                await _db.Workers.AddAsync(workerNew);
                await _db.SaveChangesAsync();
            }
        }

        await _signInManager.SignInAsync(user, isPersistent: true);

        await AddLoginCookies(Response, user);

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

    [AllowAnonymous]
    [HttpPost("request-reset-password")]
    public async Task<ActionResult> RequestResetPassword(RequestResetPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
        {
            return NoContent();
        }

        // prevent external (e.g. google) users from setting a password (for now)
        if (await _db.ExternalUsers.AnyAsync(x => x.Email == user.Email))
        {
            return NoContent();
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var url = $"{_configuration["WebBaseUrl"]}/reset-password?userId={UrlEncoder.Default.Encode(user.Id)}&token={UrlEncoder.Default.Encode(token)}";

        await _mailService.SendEmailAsync(new MailRequest
        {
            ToEmail = user.Email!,
            Subject = "[Ordo] Vaihda salasanasi",
            Body = $"Hei,<br /><br /><a href=\"{url}\">Pääset vaihtamaan salasanasi painamalla tästä</a><br /><br />Linkki on voimassa yhden vuorokauden.",
        });

        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId);

        if (user == null)
        {
            throw new InvalidOperationException();
        }

        var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);

        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        return NoContent();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAsync()
    {
        await _signInManager.SignOutAsync();
        Response.Cookies.Delete("username");
        Response.Cookies.Delete("role");

        return NoContent();
    }

    async Task AddLoginCookies(HttpResponse response, IdentityUser user)
    {
        response.Cookies.Append("username", user.UserName!, new CookieOptions
        {
            Expires = DateTimeOffset.Now.AddDays(365),
            IsEssential = true,
            SameSite = SameSiteMode.Lax,
        });

        var role = await _userManager.IsInRoleAsync(user, RoleNames.Manager) ? "manager" : "worker";

        response.Cookies.Append("role", role, new CookieOptions
        {
            Expires = DateTimeOffset.Now.AddDays(365),
            IsEssential = true,
            SameSite = SameSiteMode.Lax,
        });
    }
}