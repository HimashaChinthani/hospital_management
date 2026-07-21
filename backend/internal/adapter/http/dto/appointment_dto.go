package dto

import "time"

type AppointmentRequest struct {
	ID              uint      `json:"id,omitempty"`
	PatientID       uint      `json:"patientID,omitempty"`
	DoctorID        uint      `json:"doctorID,omitempty"`
	AppointmentDate time.Time `json:"appointmentDate,omitempty"`
	AppointmentTime string    `json:"appointmentTime,omitempty"`
	Status          string    `json:"status,omitempty"`
}

type AppointmentResponse struct {
	ID              uint      `json:"id,omitempty"`
	PatientID       uint      `json:"patientID,omitempty"`
	DoctorID        uint      `json:"doctorID,omitempty"`
	AppointmentDate time.Time `json:"appointmentDate,omitempty"`
	AppointmentTime string    `json:"appointmentTime,omitempty"`
	Status          string    `json:"status,omitempty"`
}
