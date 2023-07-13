using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;

namespace Ordo.Api.Messaging;

public class MessagingService : IMessagingService, IHostedService
{
    private FirebaseMessaging _messaging => FirebaseMessaging.DefaultInstance;
    private readonly ILogger _logger;

    public MessagingService(ILogger<MessagingService> logger)
    {
        _logger = logger;

        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.GetApplicationDefault()
        });
    }

    public async Task SubscribeToTopicAsync(string topic, string token)
    {
        await _messaging.SubscribeToTopicAsync(new List<string> { token }, topic);
    }

    public async Task UnsubscribeFromTopicAsync(string topic, string token)
    {
        await _messaging.UnsubscribeFromTopicAsync(new List<string> { token }, topic);
    }

    public async Task SendMessageToTopicAsync(string topic, string title, string body)
    {
        await _messaging.SendAsync(new Message
        {
            Topic = topic,
            Notification = new Notification
            {
                Title = title,
                Body = body,
                ImageUrl = "https://ordo.radiak.fi/favicon.svg",
            },
            Webpush = new WebpushConfig
            {
                FcmOptions = new WebpushFcmOptions
                {
                    Link = "https://ordo.radiak.fi/gigs"
                }
            }
        });
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}