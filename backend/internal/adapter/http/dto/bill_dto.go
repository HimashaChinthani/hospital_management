package dto

import "time"

type BillRequest struct {
	ID            uint      `json:"id,omitempty"`
	AppointmentID uint      `json:"appointmentID,omitempty"`
	Amount        float64   `json:"amount,omitempty"`
	PaymentStatus string    `json:"paymentStatus,omitempty"`
	CreatedAt     time.Time `json:"createdAt,omitempty"`
	BillsCol      string    `json:"billsCol,omitempty"`
}

type BillResponse struct {
	ID            uint      `json:"id,omitempty"`
	AppointmentID uint      `json:"appointmentID,omitempty"`
	Amount        float64   `json:"amount,omitempty"`
	PaymentStatus string    `json:"paymentStatus,omitempty"`
	CreatedAt     time.Time `json:"createdAt,omitempty"`
	BillsCol      string    `json:"billsCol,omitempty"`
}
