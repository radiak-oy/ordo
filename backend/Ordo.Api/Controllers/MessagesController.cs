using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Ordo.Api.Dtos;
using Ordo.Api.Messaging;
using Ordo.Api.Security;

namespace Ordo.Api.Controllers;

[Authorize(Roles = RoleNames.Worker)]
[ApiController]
[Route("messages")]
public class MessagesController : ControllerBase
{
    private readonly IMessagingService _messaging;
    private readonly UserManager<IdentityUser> _userManager;

    public MessagesController(IMessagingService messaging, UserManager<IdentityUser> userManager)
    {
        _messaging = messaging;
        _userManager = userManager;
    }

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        throw new InvalidOperationException("User ID is missing");

    [HttpPost("subscribers")]
    public async Task<ActionResult> Subscribe(SubscribeToTopicDto dto)
    {
        try
        {
            await _messaging.SubscribeToTopicAsync(dto.Topic, dto.Token);
        }
        catch
        {
            return UnprocessableEntity("Failed to subscribe.");
        }

        var user = await _userManager.FindByIdAsync(UserId);

        if (user == null) throw new InvalidOperationException();

        var claims = await _userManager.GetClaimsAsync(user);

        if (!claims.Any(c => c.Type == ClaimNames.FcmToken && c.Value == dto.Token))
        {
            await _userManager.AddClaimAsync(user, new Claim(ClaimNames.FcmToken, dto.Token));
        }

        return NoContent();
    }

    [HttpDelete("subscribers")]
    public async Task<ActionResult> Unsubscribe(UnsubscribeFromTopicDto dto)
    {
        try
        {
            await _messaging.UnsubscribeFromTopicAsync(dto.Topic, dto.Token);
        }
        catch
        {
            return UnprocessableEntity("Failed to unsubscribe.");
        }

        var user = await _userManager.FindByIdAsync(UserId);

        if (user == null) throw new InvalidOperationException();

        await _userManager.RemoveClaimAsync(user, new Claim(ClaimNames.FcmToken, dto.Token));

        return NoContent();
    }
}