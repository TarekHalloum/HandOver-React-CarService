import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const { userType, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        {/* Logo always visible (left) */}
        <NavLink className="navbar-brand" to="/">
          <img src="/assets/handover_logo.png" alt="HandOver Logo" height="40" />
        </NavLink>

        {/* Navbar content - collapsible */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Guest and User see full navigation */}
            {(userType === 'guest' || userType === 'user') && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/" end>Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/ai-scan">AI Scan</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-scans">My Scans</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/contact">Contact</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register-repairer">Register Repairer</NavLink>
                </li>
              </>
            )}

            {/* Guest sees Login */}
            {userType === 'guest' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
              </li>
            )}

            {/* User and Repairer see Logout */}
            {userType !== 'guest' && (
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                  Logout
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
