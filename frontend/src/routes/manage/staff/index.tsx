import { useLoaderData, useNavigate } from 'react-router-dom';
import { WorkerDto } from '../../../api';
import { MdAdd } from 'react-icons/md';

export default function Index() {
  const navigate = useNavigate();

  const workers = useLoaderData() as WorkerDto[];

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        className="mb-4 btn-primary-outline"
        onClick={() => navigate('add')}
      >
        <MdAdd className="mr-1" /> <span>Lisää työntekijä</span>
      </button>
      {workers.length === 0 && <span className="mb-2">Ei henkilöstöä.</span>}
      {workers.map((x) => (
        <div
          key={x.id}
          className="mb-4 p-2 w-full flex rounded cursor-pointer border-2 border-secondary-300 hover:border-secondary-400"
          onClick={() => navigate(x.id)}
        >
          <div className="w-2/3 flex flex-col">
            <span className="mb-2">{x.name}</span>
            <div className="flex flex-wrap">
              {x.qualifications.map((q) => (
                <span
                  key={q.id}
                  className="mr-1 mb-1 px-2 rounded font-medium text-white bg-primary-500"
                >
                  {q.name}
                </span>
              ))}
            </div>
          </div>
          <div className="grow"></div>
        </div>
      ))}
    </div>
  );
}
