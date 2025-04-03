function DoctorCard({ doctor, onBook }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
      <h3>{doctor.name}</h3>
      <p>Specialization: {doctor.specialization}</p>
      <p>Bio: {doctor.bio || 'N/A'}</p>
      <button onClick={() => onBook(doctor)}>Book Appointment</button>
    </div>
  );
}

export default DoctorCard;