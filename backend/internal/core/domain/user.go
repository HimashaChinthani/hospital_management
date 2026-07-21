package domain

import "time"

type User struct {
	ID        uint
	FirstName string
	LastName  string
	Email     string
	Password  string
	Phone     string
	RoleID    uint
	CreatedAt time.Time
	UpdatedAt time.Time
}
