package dto

type PrescriptionItemRequest struct {
	ID             uint   `json:"id,omitempty"`
	PrescriptionID uint   `json:"prescriptionID,omitempty"`
	MedicineID     uint   `json:"medicineID,omitempty"`
	Dosage         string `json:"dosage,omitempty"`
	Duration       string `json:"duration,omitempty"`
}

type PrescriptionItemResponse struct {
	ID             uint   `json:"id,omitempty"`
	PrescriptionID uint   `json:"prescriptionID,omitempty"`
	MedicineID     uint   `json:"medicineID,omitempty"`
	Dosage         string `json:"dosage,omitempty"`
	Duration       string `json:"duration,omitempty"`
}
