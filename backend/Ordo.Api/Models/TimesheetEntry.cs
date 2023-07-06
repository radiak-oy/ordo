namespace Ordo.Api.Models;

public class TimesheetEntry
{
    public string WorkerId { get; set; } = null!;
    public string GigId { get; set; } = null!;
    public DateTimeOffset ClockIn { get; set; }
    public DateTimeOffset ClockOut { get; set; }
    public bool IsConfirmed { get; set; } = false;
}