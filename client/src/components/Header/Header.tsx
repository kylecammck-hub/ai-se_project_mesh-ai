import { NavLink, useNavigate } from 'react-router-dom';
import { LogoMark } from '../icons/Icons';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

type Props = {
  onMenuOpen: () => void;
  onMenuClose: () => void;
  isMobileMenuOpen: boolean;
};

export default function Header({ onMenuOpen, onMenuClose, isMobileMenuOpen }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return `header__link${isActive ? ' header__link_active' : ''}`;
  }

  function handleLogout() {
    logout();
    onMenuClose();
    navigate('/login', { replace: true });
  }

  return (
    <header className={isMobileMenuOpen ? 'header header_mobile' : 'header'}>
      <button
        type="button"
        className="header__menu-btn"
        aria-label="Open menu"
        onClick={onMenuOpen}
      />

      <div className="header__logo">
        <LogoMark className="header__logo-icon" />
        <span className="header__logo-text">Mesh AI</span>
      </div>

      <nav className={isMobileMenuOpen ? 'header__nav header__nav_mobile' : 'header__nav'}>
        <NavLink to="/knowledge" className={getNavLinkClass} onClick={onMenuClose}>
          Knowledge Base
        </NavLink>
        <NavLink to="/chat" className={getNavLinkClass} onClick={onMenuClose}>
          Chat
        </NavLink>
        <button type="button" className="header__link header__logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </nav>
    </header>
  );
}
