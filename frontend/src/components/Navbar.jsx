import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#282c34',
      color: 'white'
    }}>
      <div>
        <Link to="/home" style={{ marginRight: '20px', color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/favorites" style={{ color: 'white', textDecoration: 'none' }}>Favorites</Link>
      </div>
      <button onClick={handleLogout} style={{ background: 'white', color: '#282c34', padding: '5px 10px', border: 'none', borderRadius: '4px' }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
