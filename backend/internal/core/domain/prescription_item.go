package domain

type PrescriptionItem struct {
	ID             uint
	PrescriptionID uint
	MedicineID     uint
	Dosage         string
	Duration       string
}
