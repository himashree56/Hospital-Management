import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, // Changed to ref 'Doctor'
  doctorName: { type: String, required: true },
  date: { type: String, required: true }, // Added to match frontend data
  timeSlot: { type: String, required: true }, // Added to store the time slot string
  timeSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }, // Changed default to 'pending'
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Appointment', appointmentSchema);