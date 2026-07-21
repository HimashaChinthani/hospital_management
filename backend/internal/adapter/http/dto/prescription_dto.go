package dto

import "time"

type PrescriptionRequest struct {
	ID            uint      `json:"id,omitempty"`
	AppointmentID uint      `json:"appointmentID,omitempty"`
	DoctorNotes   string    `json:"doctorNotes,omitempty"`
	CreatedAt     time.Time `json:"createdAt,omitempty"`
}

type PrescriptionResponse struct {
	ID            uint      `json:"id,omitempty"`
	AppointmentID uint      `json:"appointmentID,omitempty"`
	DoctorNotes   string    `json:"doctorNotes,omitempty"`
	CreatedAt     time.Time `json:"createdAt,omitempty"`
}
