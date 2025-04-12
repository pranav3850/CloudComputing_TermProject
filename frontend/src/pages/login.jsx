import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  '../pages/login.css'
const Login = ({ setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '484685903766-o8hg91ntv7iced85rqgegr2ngjvsbnji.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-login'),
        {
          theme: 'outline',
          size: 'large',
        }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    const token = response.credential;
    localStorage.setItem('token', token);

    // Optional: store email
    const base64Url = token.split('.')[1];
    const decodedPayload = JSON.parse(window.atob(base64Url));
    localStorage.setItem('email', decodedPayload.email);

    // ✅ CRITICAL: update state in App.jsx
    setToken(token);

    // ✅ Redirect immediately
    navigate('/home');
  };

  return (
    <div className="login-page">
      <h2>Login to Weather Dashboard</h2>
      <div id="google-login"></div>
    </div>
  );
};

export default Login;
