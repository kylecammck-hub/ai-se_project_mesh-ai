import { useEffect, useRef, useState } from 'react';
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return `header__link${isActive ? ' header__link_active' : ''}`;
  }

  function handleLogout() {
    setIsUserMenuOpen(false);
    logout();
    onMenuClose();
    navigate('/login', { replace: true });
  }

  // Close the user menu when clicking anywhere outside of it, or on Escape.
  useEffect(() => {
    if (!isUserMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

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
      </nav>

      <div className="header__account" ref={userMenuRef}>
        <button
          type="button"
          className="header__user-btn"
          onClick={() => setIsUserMenuOpen((open) => !open)}
          aria-haspopup="true"
          aria-expanded={isUserMenuOpen}
        >
          <span className="header__user-name">{user?.name ?? 'Account'}</span>
          <svg
            className={`header__user-chevron${isUserMenuOpen ? ' header__user-chevron_open' : ''}`}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            aria-hidden="true"
          >
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isUserMenuOpen && (
          <div className="header__user-menu" role="menu">
            <button
              type="button"
              className="header__user-menu-item"
              role="menuitem"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
