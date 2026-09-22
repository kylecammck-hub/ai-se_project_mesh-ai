import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthTabs from '../../components/AuthTabs/AuthTabs';
import { useAuth } from '../../context/AuthContext';
import { getEmailError, getPasswordError } from '../../utils/validation';
import './Login.css';

type LocationState = {
  from?: { pathname: string };
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password);
    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? '/knowledge', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <h1 className="auth__title">Welcome back</h1>
          <p className="auth__subtitle">Access your organisation&apos;s secure workspace</p>
        </div>

        <AuthTabs />

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__field">
            <span className="auth__label">Email</span>
            <input
              type="email"
              className="auth__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="auth__field">
            <span className="auth__label">Password</span>
            <input
              type="password"
              className="auth__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="auth__error">{error}</p>}

          <button type="submit" className="auth__button" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </section>
  );
}
