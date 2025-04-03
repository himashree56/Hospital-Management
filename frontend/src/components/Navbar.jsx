import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/profile">Profile</Link>
          {user.role === 'patient' && <Link to="/doctors">Doctors</Link>}
          <Link to={`/${user.role}/dashboard`}>Dashboard</Link>
          <button style={{background:"black"}} onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;