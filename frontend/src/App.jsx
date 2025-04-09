import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';

const AppWrapper = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
