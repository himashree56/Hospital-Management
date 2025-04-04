import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

export const bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, date, time } = req.body;
    if (!userId || !doctorId || !date || !time) {
      return res.status(400).json({ message: 'User ID, doctor ID, date, and time are required' });
    }
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: User ID does not match' });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.approved) {
      return res.status(404).json({ message: 'Doctor not found or not approved' });
    }
    const existingAppointment = await Appointment.findOne({
      patientId: userId,
      doctorId,
      date,
      timeSlot: time,
      status: { $ne: 'cancelled' },
    });
    if (existingAppointment) {
      return res.status(400).json({ message: 'You have already booked this time slot' });
    }


    const slot = doctor.timeSlots.find(
      (s) => s.date === date && s.slot === time && !s.isBooked
    );
    if (!slot) {
      return res.status(400).json({ message: 'Time slot not available' });
    }
    slot.isBooked = true;
    await doctor.save();
    const newAppointment = new Appointment({
      patientId: userId,
      doctorId,
      doctorName: doctor.name,
      date,
      timeSlot: time,
      status: 'scheduled',
    });

    await newAppointment.save();

    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};