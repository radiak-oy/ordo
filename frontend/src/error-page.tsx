import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  let errorMessage = 'Unexpected error';
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  }
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="text-xl font-bold">
        Tapahtui virhe. Yritä uudelleen.
      </span>
      <span>Tekninen tieto: &quot;{errorMessage}&quot; </span>
    </div>
  );
}
