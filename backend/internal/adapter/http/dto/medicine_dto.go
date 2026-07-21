package dto

type MedicineRequest struct {
	ID            uint    `json:"id,omitempty"`
	MedicineName  string  `json:"medicineName,omitempty"`
	Description   string  `json:"description,omitempty"`
	UnitPrice     float64 `json:"unitPrice,omitempty"`
	StockQuantity int     `json:"stockQuantity,omitempty"`
}

type MedicineResponse struct {
	ID            uint    `json:"id,omitempty"`
	MedicineName  string  `json:"medicineName,omitempty"`
	Description   string  `json:"description,omitempty"`
	UnitPrice     float64 `json:"unitPrice,omitempty"`
	StockQuantity int     `json:"stockQuantity,omitempty"`
}
