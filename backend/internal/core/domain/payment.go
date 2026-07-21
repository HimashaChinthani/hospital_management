package domain

import "time"

type Payment struct {
	ID            uint
	BillID        uint
	PaymentMethod string
	PaymentDate   time.Time
	Amount        float64
}
