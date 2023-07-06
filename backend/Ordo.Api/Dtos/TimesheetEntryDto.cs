using Ordo.Api.Models;

namespace Ordo.Api.Dtos;

public readonly record struct TimesheetEntryDto
{
    public string WorkerId { get; init; }
    public string GigId { get; init; }
    public DateTimeOffset ClockIn { get; init; }
    public DateTimeOffset ClockOut { get; init; }
    public bool IsConfirmed { get; init; }

    public static TimesheetEntryDto FromModel(TimesheetEntry entry) => new TimesheetEntryDto
    {
        WorkerId = entry.WorkerId,
        GigId = entry.GigId,
        ClockIn = entry.ClockIn,
        ClockOut = entry.ClockOut,
        IsConfirmed = entry.IsConfirmed
    };
}