using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordo.Api.Dtos;
using Ordo.Api.Security;

namespace Ordo.Api.Controllers;

[Authorize(PolicyNames.RequireAdminToken)]
[ApiController]
[Route("admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public AdminController(
        ApplicationDbContext db,
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager)
    {
        _db = db;
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUserAsync(string role, string email, string? password)
    {
        var user = new IdentityUser { UserName = email, Email = email };
        var resultCreateUser = password != null
            ? await _userManager.CreateAsync(user, password)
            : await _userManager.CreateAsync(user);

        if (!resultCreateUser.Succeeded)
        {
            return BadRequest(resultCreateUser.Errors);
        }

        var resultAddRole = await _userManager.AddToRoleAsync(user, role);
        if (!resultAddRole.Succeeded)
        {
            return BadRequest(resultAddRole.Errors);
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(UserDto.FromModel(user, roles.ToArray()));
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        var userRolesPairs = await Task.WhenAll(users.Select(async user =>
            new
            {
                User = user,
                Roles = await _userManager.GetRolesAsync(user)
            }));

        return Ok(userRolesPairs.Select(pair => UserDto.FromModel(pair.User, pair.Roles.ToArray())));
    }

    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetUserByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(UserDto.FromModel(user, roles.ToArray()));
    }

    [HttpPut("users/{userId}/password")]
    public async Task<IActionResult> UpdatePasswordAsync(string userId, string? password)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (await _userManager.HasPasswordAsync(user))
        {
            await _userManager.RemovePasswordAsync(user);
        }

        if (password != null)
        {
            await _userManager.AddPasswordAsync(user, password);
        }

        return NoContent();
    }

    [HttpGet("users/{userId}/claims")]
    public async Task<IActionResult> GetClaims(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        var claims = await _userManager.GetClaimsAsync(user);

        return Ok(new { user.Id, user.UserName, claims });
    }

    [HttpPost("users/{userId}/claims")]
    public async Task<IActionResult> AddClaimAsync(string userId, string claimType, string claimValue)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var claim = new Claim(claimType, claimValue);

        // prevent duplicates
        var claims = await _userManager.GetClaimsAsync(user);
        if (claims.Any(x => x.Type == claim.Type && x.Value == claim.Value))
            return NoContent();

        await _userManager.AddClaimAsync(user, claim);

        return NoContent();
    }

    [HttpDelete("users/{userId}/claims")]
    public async Task<IActionResult> DeleteClaimAsync(string userId, string claimType, string claimValue)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var claim = new Claim(claimType, claimValue);

        await _userManager.RemoveClaimAsync(user, claim);
        return NoContent();
    }

    [HttpDelete("users/{userId}")]
    public async Task<IActionResult> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var worker = await _db.Workers.SingleOrDefaultAsync(w => w.Id == user.Id);

        if (worker != null)
        {
            _db.Workers.Remove(worker);
            await _db.SaveChangesAsync();
        }

        await _userManager.DeleteAsync(user);
        return NoContent();
    }
}