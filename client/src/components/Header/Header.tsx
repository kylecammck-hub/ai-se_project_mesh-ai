import { NavLink } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  onMenuOpen: () => void;
}

export default function Header({ isMobileMenuOpen, onMenuOpen }: HeaderProps) {
  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return `header__link${isActive ? ' header__link_active' : ''}`;
  }

  return (
    <header className="header">
      <div className="header__logo">
        <span className="header__logo-icon" aria-hidden="true" />
        <span className="header__logo-text">Mesh AI</span>
      </div>

      <nav className="header__nav">
        <NavLink to="/knowledge" className={getNavLinkClass}>
          Knowledge Base
        </NavLink>
        <NavLink to="/chat" className={getNavLinkClass}>
          Chat
        </NavLink>
      </nav>

      <button
        type="button"
        className="header__menu-btn"
        aria-label="Open menu"
        aria-expanded={isMobileMenuOpen}
        onClick={onMenuOpen}
      >
        ☰
      </button>
    </header>
  );
}
