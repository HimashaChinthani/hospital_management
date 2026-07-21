package dto

type DoctorRequest struct {
	ID              uint   `json:"id,omitempty"`
	UserID          uint   `json:"userID,omitempty"`
	DepartmentID    uint   `json:"departmentID,omitempty"`
	Specialization  string `json:"specialization,omitempty"`
	ExperienceYears int    `json:"experienceYears,omitempty"`
}

type DoctorResponse struct {
	ID              uint   `json:"id,omitempty"`
	UserID          uint   `json:"userID,omitempty"`
	DepartmentID    uint   `json:"departmentID,omitempty"`
	Specialization  string `json:"specialization,omitempty"`
	ExperienceYears int    `json:"experienceYears,omitempty"`
}
