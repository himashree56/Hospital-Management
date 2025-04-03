import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      axios
        .get('http://localhost:5000/api/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    const userData = await axios.get('http://localhost:5000/api/auth/me');
    setUser(userData.data);
    return userData.data.role; 
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    const userData = await axios.get('http://localhost:5000/api/auth/me');
    setUser(userData.data);
    return userData.data.role;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, login, register, logout } = context;

  const navigateBasedOnRole = (role) => {
    if (role === 'patient') navigate('/patient/dashboard');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  const loginWithNav = async (email, password) => {
    const role = await login(email, password);
    navigateBasedOnRole(role);
  };

  const registerWithNav = async (name, email, password, role) => {
    const userRole = await register(name, email, password, role);
    navigateBasedOnRole(userRole);
  };

  const logoutWithNav = () => {
    logout();
    navigate('/');
  };

  return {
    user,
    loading,
    login: loginWithNav,
    register: registerWithNav,
    logout: logoutWithNav,
  };
};

export default AuthContext;