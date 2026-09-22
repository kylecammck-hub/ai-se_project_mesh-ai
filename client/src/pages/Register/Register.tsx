import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTabs from '../../components/AuthTabs/AuthTabs';
import { useAuth } from '../../context/AuthContext';
import { getEmailError, getNameError, getPasswordError } from '../../utils/validation';
import '../Login/Login.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const nameError = getNameError(name);
    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password);
    if (nameError || emailError || passwordError) {
      setError(nameError || emailError || passwordError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await register(email, password, name);
      navigate('/knowledge', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <h1 className="auth__title">Create account</h1>
          <p className="auth__subtitle">Access your organisation&apos;s secure workspace</p>
        </div>

        <AuthTabs />

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__field">
            <span className="auth__label">Name</span>
            <input
              type="text"
              className="auth__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </label>

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
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {error && <p className="auth__error">{error}</p>}

          <button type="submit" className="auth__button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  );
}
