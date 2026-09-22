import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthTabs from '../../components/AuthTabs/AuthTabs';
import { useAuth } from '../../context/AuthContext';
import { useFormWithValidation, type Validators } from '../../hooks/useFormWithValidation';
import { getEmailError, getPasswordError } from '../../utils/validation';
import './Login.css';

type LocationState = {
  from?: { pathname: string };
};

type LoginValues = {
  email: string;
  password: string;
};

const initialValues: LoginValues = { email: '', password: '' };

const validators: Validators<LoginValues> = {
  email: getEmailError,
  password: (value) => getPasswordError(value),
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { values, errors, isValid, handleChange } = useFormWithValidation(
    initialValues,
    validators,
  );
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || isSubmitting) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      await login(values.email, values.password);
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? '/knowledge', { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to log in');
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

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <label className="auth__field">
            <span className="auth__label">Email</span>
            <input
              type="email"
              name="email"
              className={`auth__input${errors.email ? ' auth__input_invalid' : ''}`}
              value={values.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              required
            />
            {errors.email && <span className="auth__field-error">{errors.email}</span>}
          </label>

          <label className="auth__field">
            <span className="auth__label">Password</span>
            <input
              type="password"
              name="password"
              className={`auth__input${errors.password ? ' auth__input_invalid' : ''}`}
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              required
            />
            {errors.password && <span className="auth__field-error">{errors.password}</span>}
          </label>

          {submitError && <p className="auth__error">{submitError}</p>}

          <button type="submit" className="auth__button" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </section>
  );
}
