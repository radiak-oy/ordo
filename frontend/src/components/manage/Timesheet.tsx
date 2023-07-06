import createApi, {
  ConfirmTimesheetEntryDto,
  TimesheetEntryDto,
} from '../../api';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface TimesheetProps {
  timesheetEntries: TimesheetEntryDto[];
}

export default function Timesheet({ timesheetEntries }: TimesheetProps) {
  const navigate = useNavigate();

  const { confirmTimesheetEntry: confirmTimesheetEntryApi } = createApi();

  async function confirmTimesheetEntry(entry: TimesheetEntryDto) {
    const result = await confirmTimesheetEntryApi(
      entry as ConfirmTimesheetEntryDto
    );

    if (!result.ok) {
      alert(result.errorMessage);
    }

    navigate(0);
  }

  return (
    <div className="p-4 flex flex-col items-start rounded border">
      <span className="mb-2 text-lg font-semibold">Työtunnit</span>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-start font-medium">Päivämäärä</th>
            <th className="text-start font-medium">Työtunnit</th>
            <th className="text-start font-medium">Hyväksytty?</th>
          </tr>
        </thead>
        <tbody>
          {timesheetEntries.map((entry) => (
            <tr key={entry.gigId} className="hover:bg-secondary-100">
              <td className="py-1">
                {format(new Date(entry.clockIn), 'dd.MM.yy, eee', {
                  locale: fi,
                })}
              </td>
              <td className="py-1">
                {format(new Date(entry.clockIn), 'HH:mm')}&ndash;
                {entry.clockOut != null
                  ? format(new Date(entry.clockOut), 'HH:mm')
                  : '--:--'}
              </td>
              <td className="py-1">
                {entry.isConfirmed ? (
                  <span className="py-1 block">Hyväksytty</span>
                ) : (
                  <button
                    type="button"
                    className="!py-1 btn-primary"
                    onClick={() => confirmTimesheetEntry(entry)}
                    disabled={entry.clockOut == null}
                  >
                    Hyväksy
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
