import { Outlet } from 'react-router-dom';
import { LogoMark } from '../icons/Icons';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__logo">
        <span className="auth-layout__logo-text">Mesh AI</span>
        <LogoMark className="auth-layout__logo-icon" />
      </div>
      <main className="auth-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
