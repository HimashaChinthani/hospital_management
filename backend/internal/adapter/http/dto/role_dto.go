package dto

type RoleRequest struct {
	ID   uint   `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

type RoleResponse struct {
	ID   uint   `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}
