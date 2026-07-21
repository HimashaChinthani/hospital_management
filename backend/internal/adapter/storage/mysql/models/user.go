package models

import (
	"github.com/himashachinthani/backend/internal/core/domain"
)

type User struct {
	Base
	FirstName string `gorm:"column:first_name"`
	LastName  string `gorm:"column:last_name"`
	Email     string `gorm:"column:email;unique"`
	Password  string `gorm:"column:password"`
	Phone     string `gorm:"column:phone"`
	RoleID    uint   `gorm:"column:role_id"`
}

// TableName sets table name
func (User) TableName() string { return "users" }

// ToDomain converts DB model to domain
func (u *User) ToDomain() *domain.User {
	if u == nil {
		return nil
	}
	return &domain.User{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Password:  u.Password,
		Phone:     u.Phone,
		RoleID:    u.RoleID,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

// UserFromDomain converts domain model to DB model
func UserFromDomain(d *domain.User) *User {
	if d == nil {
		return nil
	}
	return &User{
		Base:      Base{ID: d.ID, CreatedAt: d.CreatedAt, UpdatedAt: d.UpdatedAt},
		FirstName: d.FirstName,
		LastName:  d.LastName,
		Email:     d.Email,
		Password:  d.Password,
		Phone:     d.Phone,
		RoleID:    d.RoleID,
	}
}
