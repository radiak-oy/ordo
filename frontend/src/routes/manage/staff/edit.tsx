import { useLoaderData, useNavigate } from 'react-router-dom';
import { WorkerDto, QualificationDto, TimesheetEntryDto } from '../../../api';
import WorkerUpsertForm from '../../../components/manage/WorkerUpsertForm';
import Timesheet from '../../../components/manage/Timesheet';
import { MdArrowBack } from 'react-icons/md';

export default function Edit() {
  const navigate = useNavigate();

  const { worker, qualifications, timesheetEntries } = useLoaderData() as {
    worker: WorkerDto;
    qualifications: QualificationDto[];
    timesheetEntries: TimesheetEntryDto[];
  };

  return (
    <>
      <button
        type="button"
        className="mb-4 btn-secondary"
        onClick={() => navigate(-1)}
      >
        <MdArrowBack className="mr-1" />
        Takaisin
      </button>
      <WorkerUpsertForm qualifications={qualifications} workerToEdit={worker} />
      <div className="my-4"></div>
      <Timesheet timesheetEntries={timesheetEntries} />
    </>
  );
}
