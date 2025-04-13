import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setToken }) => { // ✅ accept setToken as a prop
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null); // ✅ update state in App.jsx
    navigate('/');  // ✅ redirect to login route
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">WeatherMate ☀️</h1>
        <div className="navbar-links">
          <Link to="/home" className="navbar-link">Home</Link>
          <Link to="/favorites" className="navbar-link">Favorites</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
