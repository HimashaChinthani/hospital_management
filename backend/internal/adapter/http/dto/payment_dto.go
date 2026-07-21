package dto

import "time"

type PaymentRequest struct {
	ID            uint      `json:"id,omitempty"`
	BillID        uint      `json:"billID,omitempty"`
	PaymentMethod string    `json:"paymentMethod,omitempty"`
	PaymentDate   time.Time `json:"paymentDate,omitempty"`
	Amount        float64   `json:"amount,omitempty"`
}

type PaymentResponse struct {
	ID            uint      `json:"id,omitempty"`
	BillID        uint      `json:"billID,omitempty"`
	PaymentMethod string    `json:"paymentMethod,omitempty"`
	PaymentDate   time.Time `json:"paymentDate,omitempty"`
	Amount        float64   `json:"amount,omitempty"`
}
