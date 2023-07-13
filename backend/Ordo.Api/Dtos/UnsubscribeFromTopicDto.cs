namespace Ordo.Api.Dtos;

public readonly record struct UnsubscribeFromTopicDto
{
    public string Token { get; init; }
    public string Topic { get; init; }
}