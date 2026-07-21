package models

import "time"

type Base struct {
	ID        uint      `gorm:"primaryKey;column:id"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`
}
