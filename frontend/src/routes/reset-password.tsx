import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import createApi from '../api';

export default function ResetPassword() {
  const { resetPassword } = createApi();

  const [searchParams] = useSearchParams();

  const userIdEncoded = searchParams.get('userId');
  if (!userIdEncoded) throw new Error('UserId not in query.');

  const tokenEncoded = searchParams.get('token');
  if (!tokenEncoded) throw new Error('Token not in query.');

  const userId = decodeURIComponent(userIdEncoded);
  const token = decodeURIComponent(tokenEncoded);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeated, setNewPasswordRepeated] = useState(newPassword);

  const [showPassword, setShowPassword] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRepeatPassword = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsSuccess(false);

    if (!inputRepeatPassword.current) return;

    inputRepeatPassword.current.setCustomValidity('');

    if (newPasswordRepeated !== newPassword) {
      inputRepeatPassword.current.setCustomValidity('Salasanat eivät täsmää.');
      return;
    }

    const result = await resetPassword(userId, token, newPassword);

    if (!result.ok) {
      setErrorMessage('Salasanan vaihto epäonnistui.');
      return;
    }

    setIsSuccess(true);
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form className="p-4 flex flex-col rounded border" onSubmit={onSubmit}>
        <label htmlFor="input-password">Uusi salasana</label>
        <input
          id="input-password"
          type={showPassword ? 'text' : 'password'}
          required
          minLength={6}
          className="mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label htmlFor="input-repeat-password">
          Kirjoita uusi salasana uudelleen
        </label>
        <input
          ref={inputRepeatPassword}
          id="input-repeat-password"
          type={showPassword ? 'text' : 'password'}
          required
          className="mb-2"
          value={newPasswordRepeated}
          onChange={(e) => setNewPasswordRepeated(e.target.value)}
        />

        <div className="mb-2 flex">
          <input
            id="input-show-password"
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="input-show-password">Näytä salasana</label>
        </div>

        {isSuccess ? (
          <>
            <span className="mb-1 font-medium">
              Salasana vaihdettu onnistuneesti.
            </span>
            <a
              href="/login"
              className="underline underline-offset-4 text-blue-500"
            >
              Siirry kirjautumissivulle
            </a>
          </>
        ) : (
          <button type="submit" className="mt-2 btn-primary">
            Vaihda salasana
          </button>
        )}

        {errorMessage.length > 0 && (
          <span className="mt-2 text-red-500">{errorMessage}</span>
        )}
      </form>
    </div>
  );
}
