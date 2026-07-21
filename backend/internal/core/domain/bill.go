package domain

import "time"

type Bill struct {
	ID            uint
	AppointmentID uint
	Amount        float64
	PaymentStatus string
	CreatedAt     time.Time
	BillsCol      string
}
