import { useState } from 'react';
import createApi from '../api';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const { requestResetPassword } = createApi();

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await requestResetPassword(email);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      return;
    }

    setIsSent(true);
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-start">
        <div className="w-full flex justify-start">
          <button
            type="button"
            className="mb-4 btn-secondary"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack className="mr-1" />
            Takaisin
          </button>
        </div>
        <form
          className="p-4 max-w-xs flex flex-col rounded border"
          onSubmit={onSubmit}
        >
          <span className="mb-2 font-medium">Pyydä salasanan vaihtoa</span>
          <label htmlFor="input-email">Sähköpostiosoite</label>
          <input
            id="input-email"
            type="email"
            required
            className="mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {isSent ? (
            <span className="font-medium">Pyyntö lähetetty.</span>
          ) : (
            <button
              type="submit"
              className="mt-2 btn-primary"
              disabled={isSent}
            >
              Lähetä pyyntö
            </button>
          )}

          {errorMessage.length > 0 && (
            <span className="text-red-500">{errorMessage}</span>
          )}
        </form>
      </div>
    </div>
  );
}
