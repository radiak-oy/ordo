import { useLoaderData, useNavigate } from 'react-router-dom';
import { ProfileDto } from '../../../api';

export default function Index() {
  const navigate = useNavigate();

  const profiles = useLoaderData() as ProfileDto[];

  return (
    <div className="flex flex-col items-start">
      {profiles.length === 0 && <span className="mb-2">Ei henkilöstöä.</span>}
      {profiles.map((x) => (
        <div
          key={x.workerId}
          className="mb-4 p-2 w-full flex rounded cursor-pointer border-2 border-secondary-300 hover:border-secondary-400"
          onClick={() => navigate(x.workerId)}
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
