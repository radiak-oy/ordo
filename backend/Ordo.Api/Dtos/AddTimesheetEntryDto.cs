namespace Ordo.Api.Dtos;

public readonly record struct AddTimesheetEntryDto
{
    public string GigId { get; init; }
    public DateTimeOffset ClockIn { get; init; }
    public DateTimeOffset ClockOut { get; init; }
}