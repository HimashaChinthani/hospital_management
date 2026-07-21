package models

import (
	"time"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type Bill struct {
	ID            uint      `gorm:"primaryKey;column:id"`
	AppointmentID uint      `gorm:"column:appointment_id"`
	Amount        float64   `gorm:"column:amount"`
	PaymentStatus string    `gorm:"column:payment_status"`
	CreatedAt     time.Time `gorm:"column:created_at"`
	BillsCol      string    `gorm:"column:billscol"`
}

// TableName sets table name
func (Bill) TableName() string { return "bills" }

// ToDomain converts DB model to domain
func (b *Bill) ToDomain() *domain.Bill {
	if b == nil {
		return nil
	}
	return &domain.Bill{
		ID:            b.ID,
		AppointmentID: b.AppointmentID,
		Amount:        b.Amount,
		PaymentStatus: b.PaymentStatus,
		CreatedAt:     b.CreatedAt,
		BillsCol:      b.BillsCol,
	}
}

// BillFromDomain converts domain model to DB model
func BillFromDomain(d *domain.Bill) *Bill {
	if d == nil {
		return nil
	}
	return &Bill{
		ID:            d.ID,
		AppointmentID: d.AppointmentID,
		Amount:        d.Amount,
		PaymentStatus: d.PaymentStatus,
		CreatedAt:     d.CreatedAt,
		BillsCol:      d.BillsCol,
	}
}
