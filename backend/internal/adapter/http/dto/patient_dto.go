package dto

import "time"

type PatientRequest struct {
	ID         uint      `json:"id,omitempty"`
	UserID     uint      `json:"userID,omitempty"`
	DOB        time.Time `json:"dOB,omitempty"`
	Gender     string    `json:"gender,omitempty"`
	BloodGroup string    `json:"bloodGroup,omitempty"`
	Address    string    `json:"address,omitempty"`
}

type PatientResponse struct {
	ID         uint      `json:"id,omitempty"`
	UserID     uint      `json:"userID,omitempty"`
	DOB        time.Time `json:"dOB,omitempty"`
	Gender     string    `json:"gender,omitempty"`
	BloodGroup string    `json:"bloodGroup,omitempty"`
	Address    string    `json:"address,omitempty"`
}
