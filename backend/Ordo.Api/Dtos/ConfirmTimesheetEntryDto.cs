namespace Ordo.Api.Dtos;

public readonly record struct ConfirmTimesheetEntryDto
{
    public string WorkerId { get; init; }
    public string GigId { get; init; }
    public DateTimeOffset ClockIn { get; init; }
    public DateTimeOffset ClockOut { get; init; }
}