import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Hardcoded creds
    if (email === 'user@example.com' && password === 'password') {
      localStorage.setItem('token', 'mock-token');
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
