import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function Profile() {
  const { user } = useContext(AuthContext);
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/doctor/profile', { specialization, bio });
    alert('Profile updated');
  };

  if (!user) return <h2>Please log in</h2>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.role === 'doctor' && (
        <form onSubmit={handleSubmit}>
          <h2>Update Doctor Profile</h2>
          <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
          <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
}

export default Profile;