package dto

type DepartmentRequest struct {
	ID             uint   `json:"id,omitempty"`
	DepartmentName string `json:"departmentName,omitempty"`
}

type DepartmentResponse struct {
	ID             uint   `json:"id,omitempty"`
	DepartmentName string `json:"departmentName,omitempty"`
}
