import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');

  const handleUpdate = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, name });
        alert('Profile updated!');
      }
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Update Name"
          />
          <button onClick={handleUpdate}>Update</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Profile;