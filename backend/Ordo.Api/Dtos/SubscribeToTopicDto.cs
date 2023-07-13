namespace Ordo.Api.Dtos;

public readonly record struct SubscribeToTopicDto
{
    public string Token { get; init; }
    public string Topic { get; init; }
}