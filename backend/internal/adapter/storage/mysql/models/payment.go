package models

import (
	"time"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type Payment struct {
	ID            uint      `gorm:"primaryKey;column:id"`
	BillID        uint      `gorm:"column:bill_id"`
	PaymentMethod string    `gorm:"column:payment_method"`
	PaymentDate   time.Time `gorm:"column:payment_date"`
	Amount        float64   `gorm:"column:amount"`
}

// TableName sets table name
func (Payment) TableName() string { return "payments" }

// ToDomain converts DB model to domain
func (p *Payment) ToDomain() *domain.Payment {
	if p == nil {
		return nil
	}
	return &domain.Payment{
		ID:            p.ID,
		BillID:        p.BillID,
		PaymentMethod: p.PaymentMethod,
		PaymentDate:   p.PaymentDate,
		Amount:        p.Amount,
	}
}

// PaymentFromDomain converts domain model to DB model
func PaymentFromDomain(d *domain.Payment) *Payment {
	if d == nil {
		return nil
	}
	return &Payment{
		ID:            d.ID,
		BillID:        d.BillID,
		PaymentMethod: d.PaymentMethod,
		PaymentDate:   d.PaymentDate,
		Amount:        d.Amount,
	}
}
