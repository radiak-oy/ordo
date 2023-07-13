namespace Ordo.Api.Messaging;

public interface IMessagingService
{
    public Task SubscribeToTopicAsync(string topic, string token);
    public Task UnsubscribeFromTopicAsync(string topic, string token);
    public Task SendMessageToTopicAsync(string topic, string title, string body);
}