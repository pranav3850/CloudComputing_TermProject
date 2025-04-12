import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/home';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';
import Footer from './components/footer';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      {token && <Navbar setToken={setToken} />}
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/home" /> : <Login setToken={setToken} />}
        />
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/favorites"
          element={token ? <Favorites /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
