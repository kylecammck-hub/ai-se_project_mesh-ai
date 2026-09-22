import { NavLink } from 'react-router-dom';
import './AuthTabs.css';

function getTabClass({ isActive }: { isActive: boolean }) {
  return `auth-tabs__tab${isActive ? ' auth-tabs__tab_active' : ''}`;
}

export default function AuthTabs() {
  return (
    <nav className="auth-tabs" aria-label="Authentication">
      <NavLink to="/login" className={getTabClass}>
        Login
      </NavLink>
      <NavLink to="/register" className={getTabClass}>
        Register
      </NavLink>
    </nav>
  );
}
