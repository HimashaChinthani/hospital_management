package domain

import "time"

type Patient struct {
	ID         uint
	UserID     uint
	DOB        time.Time
	Gender     string
	BloodGroup string
	Address    string
}
