import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/DoctorProfile.css';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/doctors/${id}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data))
      .catch((err) => console.error('Error fetching doctor:', err));

    fetch(`http://localhost:5000/api/doctors/${id}/availability`)
      .then((res) => res.json())
      .then((data) => setAvailability(data))
      .catch((err) => console.error('Error fetching availability:', err));
  }, [id]);

  return (
    <div className="doctor-profile-container">
      {doctor ? (
        <>
          <h2>{doctor.name}</h2>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <h3>Availability</h3>
          <ul>
            {availability.map((slot) => (
              <li key={slot._id}>{slot.date} - {slot.time}</li>
            ))}
          </ul>
          <a href="/book">Book Appointment</a>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DoctorProfile;